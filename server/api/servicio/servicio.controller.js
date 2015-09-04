'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var base64 = require('base64-js')
var Parametros = require('./servicio.model');
var Filtro = require('../filtro/filtro.model');
var Producto = require('../producto/producto.model');
var Atributo = require('../atributo/atributo.model');
var BannerPrincipal = require('../banner_principal/banner_principal.model');
var Seccion = require('../seccion/seccion.model');
var Variante = require('../variante/variante.model');
var Tienda = require('../tienda/tienda.model');
var Tracking = require('../tracking/tracking.model');
var constantes = require('../../constantes');
var config = require('../../config/environment');

/*(+) Servicio de encriptacion */

//https://github.com/chengxianga2008/node-cryptojs-aes
var CryptoJS = require('crypto-js');

//https://code.google.com/p/crypto-js/
//seccion: The Cipher Output
var JsonFormatter = {
  stringify: function (cipherParams) {
    var jsonObj = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) };// create json object with ciphertext
    if (cipherParams.iv) { jsonObj.iv = cipherParams.iv.toString(); }// optionally add iv and salt
    if (cipherParams.salt) { jsonObj.s = cipherParams.salt.toString(); }
    return JSON.stringify(jsonObj);// stringify json object
  },

  parse: function (jsonStr) {
    // parse json string
    var jsonObj = JSON.parse(jsonStr);

    // extract ciphertext from json object, and create cipher params object
    var cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct)
    });

    // optionally extract iv and salt
    if (jsonObj.iv) {
      cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv)
    }
    if (jsonObj.s) {
      cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s)
    }
    return cipherParams;
  }
};

var encriptar = function (texto) {
  var key = CryptoJS.enc.Utf8.parse(constantes.seguridad.enc_key);
  var iv = CryptoJS.enc.Utf8.parse(constantes.seguridad.enc_iv);
  var data = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(texto), key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding,
      format: JsonFormatter  
  });
  //obtiene solo el dato string encriptado
  return JSON.parse(data.toString()).ct;
};

exports.encriptar = encriptar;

//metodo para desencriptar
var desencriptar = function (texto_encriptado) {
  var key = CryptoJS.enc.Utf8.parse(constantes.seguridad.enc_key);
  var iv = CryptoJS.enc.Utf8.parse(constantes.seguridad.enc_iv);
  return CryptoJS.AES.decrypt(texto_encriptado, key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding
  }).toString(CryptoJS.enc.Utf8);
};
exports.desencriptar = desencriptar;

//compara los tokens
var verficaTokenTRX = function(token_api, req, res, callback){
  if(!token_api) {
    console.log('Token no encontrado.');
    return handleError(res, "Acceso invalidado.");
  }
  Parametros.findById(constantes.parametros.id_token_transacciones, function (err, token_local){
    if(err) {
      console.log('Token no configurado.');
      return handleError(res, err);
    }
    if(desencriptar(token_local.valor) === desencriptar(token_api)){
      callback(req, res);
    } else {
      console.log('Token no autorizado.');
      return handleError(res, err);
    }
  });   
}
//Define o modifica token de transacciones
//
// OJO!
// El token de transacciones es dinamico, el manager
// decide si actualiza el token a una contruido de forma
// aleatoria.
//
exports.tokenTienda = function(req, res){
  
  //comprueba tokens
  console.log("Comprueba tokens");
  if(!req.body.token_seguridad) {
    return handleError(res, "Acceso invalidado.");
  }
  if(!req.body.token_transacciones) {
    return handleError(res, "Formato no es correcto.");
  }

  //obtiene token de seguridad del manager
  console.log("Obtiene token de seguridad del manager");
  var decryt_token_seguridad_manager = desencriptar(req.body.token_seguridad);
  var decryt_token_seguridad_tienda = "";

  //busca parametro token de seguridad
  console.log("Busca parametro " + constantes.parametros.id_token_seguridad);
  Parametros.findById(constantes.parametros.id_token_seguridad, function(err, param){
    console.dir(param);
    
    //maneja error en busqueda
    if (err) return handleError(res, err);

    //si parametro token seguridad exite
    if (param){

      console.log("Parametro " + constantes.parametros.id_token_seguridad + " existe : " + param.valor);
      //obtiene token desencriptado y compara

      console.log("Obtiene token tienda desde BD");
      decryt_token_seguridad_tienda = desencriptar(param.valor);

      console.log("Verifica si paramentros son iguales");
      if (decryt_token_seguridad_manager !== decryt_token_seguridad_tienda) {
        console.log("Error 1");
        return handleError(res, "Acceso invalidado.");
      }
      
      console.log("Busca parametro " + constantes.parametros.id_token_transacciones);
      //actualiza token de transacciones
      Parametros.findById(constantes.parametros.id_token_transacciones, function(err, param2){
        if (err) return handleError(res, err);
        
        if (param2){
          
          console.log("Paramtro " + constantes.parametros.id_token_transacciones + " existe : " + param2.valor);
          console.log("Actualiza parametro " + constantes.parametros.id_token_transacciones);

          param2.update({
            _id: constantes.parametros.id_token_transacciones,
            valor: req.body.token_transacciones
          }, function(err){
            if (err) return handleError(res, err);
            //console.log("Operacion OK!");
            return res.send(200, constantes.parametros.respuesta_OK);
          });
        } else {
          
          console.log("Paramtro " + constantes.parametros.id_token_transacciones + " NO existe");
          console.log("Crea paramtro " + constantes.parametros.id_token_transacciones);

          Parametros.create({
            _id: constantes.parametros.id_token_transacciones,
            valor: req.body.token_transacciones
          }, function(err){
            if (err) return handleError(res, err);
            console.log("Operacion OK!");
            return res.send(200, constantes.parametros.respuesta_OK);
          });
        }
      });

    //si parametro token seguridad NO exite
    } else {
      
      console.log("Crea parametro " + constantes.parametros.id_token_seguridad);
      //crea token seguridad con valores por defecto
      Parametros.create({
        _id: constantes.parametros.id_token_seguridad,
        valor: constantes.seguridad.token_seguridad
      }, function(err, param3){

        if (err) return handleError(res, err);

        console.log("Obtiene valor desencriptado desde BD");
        //verifica token seguridad
        var decryt_token_seguridad_tienda = desencriptar(param3.valor);
        if (decryt_token_seguridad_manager !== decryt_token_seguridad_tienda) return handleError(res, "Acceso invalidado.");
        
        console.log("Busca parametro " + constantes.parametros.id_token_transacciones);
        //actualiza token de transacciones
        Parametros.findById(constantes.parametros.id_token_transacciones, function(err, param3){
          
          if (err) return handleError(res, err);
          
          if (param3){

            console.log("Actualiza paramtro " + constantes.parametros.id_token_transacciones);
            param3.update({
              _id: constantes.parametros.id_token_transacciones,
              valor: req.body.token_transacciones
            }, function(err){
              if (err) return handleError(res, err);
              
              console.log("Operacion OK!");
              return res.send(200, constantes.parametros.respuesta_OK);
            });

          } else {

            console.log("Crea paramtro " + constantes.parametros.id_token_transacciones);
            Parametros.create({
              _id: constantes.parametros.id_token_transacciones,
              valor: req.body.token_transacciones
            }, function(err){
              if (err) return handleError(res, err);
              
              console.log("Operacion OK!");
              return res.send(200, constantes.parametros.respuesta_OK);
            });
          }
        });

      });
    }
  });
}

exports.EncriptarCheckout = function(req, res){
  var texto = JSON.stringify(req.body);

  var encriptado = encriptar(texto);
  //console.dir(encriptado);
  return res.json(200, encriptado);
}
//agrega documentos
exports.addDocuments = function(req, res){
  verficaTokenTRX(req.body.token, req, res, function(req, res) {
    var base = base64.fromByteArray(req.body.archivo);

    var filename = path.join(__dirname, config.constantes.carpeta_publica+req.body.ruta+'/'+req.body.nombre);
    console.dir(filename);

    fs.writeFile(filename, base, 'base64', function(err){    
      if(err)
      {
        console.dir(err);

        return handleError(res, err);
      }
      else{
        console.log('exito!');
        console.dir(req.body.nombre);
        return res.send(200, constantes.parametros.respuesta_OK);
      }
    });
  });  
};

//elimina documentos
exports.removeDocuments = function(req, res){
  //compara tokens de transacciones
  verficaTokenTRX(req.body.token, req, res, function(req, res) {

    var filename = path.join(__dirname, config.constantes.carpeta_publica+req.body.ruta+'/'+req.body.nombre);
    console.dir(filename);

    fs.unlink(filename, function(err){    
      if(err)
      {
        return res.send(200, constantes.parametros.respuesta_OK);
      }
      if(!filename) { 
        return res.send(200, constantes.parametros.respuesta_OK);
      }
      else{
        console.log('exito!');
        return res.send(200, constantes.parametros.respuesta_OK);
      }
    });
  });
};

//agrega imágenes
exports.addImagen = function(req, res){  

  verficaTokenTRX(req.body.token, req, res, function(req, res) {
    //console.dir(req.body.token);
    //console.dir(req.body.ruta);
    //console.dir(req.body.nombre);

    //variable que contiene el archivo
    var base = base64.fromByteArray(req.body.archivo);

    //guarda imagen original 
    var filename = path.join(__dirname, config.constantes.carpeta_publica+req.body.ruta+'/'+req.body.nombre);
    //console.dir(filename);

    fs.writeFile(filename, base, 'base64', function(err){    
      if(err)
      {
        console.dir(err);

        return handleError(res, err);
      }
      else{
        //console.log('exito!');
        //console.dir(req.body.nombre);
        return res.send(200, constantes.parametros.respuesta_OK);
      }
    });


  });
};

exports.removeImagen = function(req, res){
  //compara tokens de transacciones
  verficaTokenTRX(req.body.token, req, res, function(req, res) {

    var filename = path.join(__dirname, config.constantes.carpeta_publica+req.body.ruta+'/'+req.body.nombre);
    //console.dir(filename);

    fs.unlink(filename, function(err){    
      if(err)
      {
        return res.send(200, constantes.parametros.respuesta_OK);
      }
      if(!filename) { 
        return res.send(200, constantes.parametros.respuesta_OK);
      }
      else{
        //console.log('exito!');
        return res.send(200, constantes.parametros.respuesta_OK);
      }
    });
  });
};

//agrega uno o mas filtros a la base de datos
exports.addFiltro = function(req, res){

  //compara tokens de transacciones
  verficaTokenTRX(req.body.token, req, res, function(req, res) {

    //busca filtro en la BD 
    Filtro.findById(req.body._id, function (err, filtro){
      if(err) { 
        return handleError(res, err); 
      }

      //elimina tokens de filtros
      delete req.body.token;
      var padre = req.body.dependencias_filtro[0];
      while(padre) {
        delete padre.token;
        padre = padre.dependencias_filtro[0];
      }

      //si no existe lo crea
      if(!filtro) { 
        Filtro.create(req.body, function(err, filtro){    
          if(err){ 
            return handleError(res, err);
          }
          return res.send(200, constantes.parametros.respuesta_OK);
        });       
      }
      //si existe lo actualiza
      else{
        filtro.update(req.body, function (err) {
          if (err) { 
            return handleError(res, err); 
          }
          return res.send(200, constantes.parametros.respuesta_OK);
        });
      }
    });
  });  
};

//elimina un filtro de la base de datos segun id
exports.removeFiltro = function(req, res){
  //compara tokens de transacciones
  verficaTokenTRX(req.body.token, req, res, function(req, res) {

    Filtro.findById(req.body._id, function (err, filtro) {
      if(err) { return handleError(res, err);  }

      if(!filtro) {  return res.send(500);  }

      filtro.remove(function(err) {
        if(err) { return handleError(res, err); }
        return res.send(200, constantes.parametros.respuesta_OK);
      });
    });
  });
};

//agrega uno o mas productos a la base de datos
exports.addProducto = function(req, res){

  //compara tokens de transacciones
  verficaTokenTRX(req.body.token, req, res, function(req, res) {
    
    Producto.findById(req.body._id, function (err, producto){
      if(err) {
        console.log('prod no encontrado');
        return handleError(res, err); 
      }

      //elimina tokens de filtros
      _.each(req.body.filtros, function(item){
        delete item.token;
        var padre = item.dependencias_filtro[0];
        while(padre) {
          delete padre.token;
          padre = padre.dependencias_filtro[0];
        }
      });
      //elimina token de stock de productos
      _.each(req.body.stock, function(stock){
        console.dir(stock);
        delete stock.token;
      });

      //si no existe lo crea
      if(!producto) {
        Producto.create(req.body, function(err, producto){    
          if(err){ 
            return handleError(res, err); 
          }
          //console.dir(producto)
          return res.send(200, constantes.parametros.respuesta_OK);    
        });       
      }
      //si existe lo actualiza
      else{
        producto.update(req.body, function (err) {
          if (err) { 
            return handleError(res, err); 
          }
          return res.send(200, constantes.parametros.respuesta_OK); 
        });
      }
    });
  });
};

//elimina un producto de la base de datos segun id
exports.removeProducto = function(req, res){
  
  //compara tokens de transacciones
  verficaTokenTRX(req.body.token, req, res, function(req, res) {

    Producto.findById(req.body._id, function (err, producto) {
      if(err) { 
        return handleError(res, err); 
      }
      if(!producto) { 
        return res.send(500); 
      }
      producto.remove(function(err) {        
        if(err) {           
          return handleError(res, err); 
        }
        return res.send(200, constantes.parametros.respuesta_OK);
      });      
    });
  });
};

exports.UpdateStock = function(req, res){

  var token = req.body[0].token;

  verficaTokenTRX(token, req, res, function(req, res) {

    Producto.findById(req.body[0]._id_producto, function (err, producto) {
      if(err) {         
        return handleError(res, err); 
      }
      if(!producto) {      
        return res.send(500); 
      }
      _.each(req.body, function(stock){
        console.dir(stock);
        delete stock.token;
      });
      producto.update({stock: req.body}, function (err) {
          if (err) { 
            return handleError(res, err); 
          }
          return res.send(200, constantes.parametros.respuesta_OK); 
        });      
    });
  });
};

//agrega uno o mas atributos a la base de datos
exports.addBannerPrincipal = function(req, res){
  
  //compara tokens de transacciones
  verficaTokenTRX(req.body.token, req, res, function(req, res) {

    //busca banner_principal en la BD
    BannerPrincipal.findById(req.body._id, function (err, banner_principal){
      if(err) { 
        return handleError(res, err); 
      }
      //si no existe lo crea
      if(!banner_principal) { 
        BannerPrincipal.create(req.body, function(err, banner_principal){    
          if(err){ 
            return handleError(res, err); 
          }
          return res.send(200, constantes.parametros.respuesta_OK);
        });       
      }
      //si existe lo actualiza
      else{
        banner_principal.update(req.body, function (err) {
          if (err) { 
            return handleError(res, err); 
          }
          return res.send(200, constantes.parametros.respuesta_OK);
        });
      }
    });  
  });
};

//elimina un banner_principal de la base de datos segun id
exports.removeBannerPrincipal = function(req, res){
  
  //compara tokens de transacciones
  verficaTokenTRX(req.body.token, req, res, function(req, res) {

    BannerPrincipal.findById(req.body._id, function (err, banner_principal) {
      if(err) { return handleError(res, err); }

      if(!banner_principal) { res.send(200, constantes.parametros.respuesta_OK); }

      banner_principal.remove(function(err) {
        if(err) { return handleError(res, err); }
        return res.send(200, constantes.parametros.respuesta_OK);
      });
    });
  });
};


//agrega uno o mas atributos a la base de datos
exports.addSeccion = function(req, res){
  
  //compara tokens de transacciones
  verficaTokenTRX(req.body.token, req, res, function(req, res) {

    Seccion.findById(req.body._id, function (err, seccion){
      
      if(err) { return handleError(res, err); }
      
      //si no existe lo crea
      if(!seccion) { 
        Seccion.create(req.body, function(err, seccion){    
          if(err){ return handleError(res, err); }
          return res.send(200, constantes.parametros.respuesta_OK);
        });       
      }
      //si existe lo actualiza
      else{
        seccion.update(req.body, function (err) {
          if (err) { return handleError(res, err); }
          return res.send(200, constantes.parametros.respuesta_OK);
        });
      }
    });
  });
};

//elimina un seccion de la base de datos segun id
exports.removeSeccion = function(req, res){
  
  //compara tokens de transacciones
  verficaTokenTRX(req.body.token, req, res, function(req, res) {

    Seccion.findById(req.body._id, function (err, seccion) {
      if(err) { return handleError(res, err); }

      if(!seccion) { return res.send(500); }

      seccion.remove(function(err) {
        if(err) { return handleError(res, err); }
        return res.send(200, constantes.parametros.respuesta_OK);
      });
    });
  });
};

//agrega una tienda a la base de datos
exports.addTienda = function(req, res){
  
  //compara tokens de transacciones
  console.log("addTienda ..");
  console.dir(req.body);
  console.log("addTienda ..");
  verficaTokenTRX(req.body.token, req, res, function(req, res) {

    Tienda.findById(req.body._id, function (err, tienda){

      if(err) return handleError(res, err);

      if(!tienda) { 
        Tienda.create(req.body, function(err, tienda){    
          if(err) return handleError(res, err);        
          return res.send(200, constantes.parametros.respuesta_OK);
        });
      }
      else {
        tienda.update(req.body, function (err) {
          if (err) return handleError(res, err);
          console.log(constantes.parametros.respuesta_OK);
          return res.send(200, constantes.parametros.respuesta_OK);
        });
      }
    });
  });
};

//obtiene y envia datos de tracking acumulados
exports.SolicitarTracking = function (req, res){
  //console.log('entro a solicitar tracking');
  verficaTokenTRX(req.body.token, req, res, function(req, res) {
    
    Tracking.find(function (err, trackings) {
      //console.dir(trackings);
      if(err) { 
        return handleError(res, err); 
      }
      return res.json(200, trackings);
    });
  });
};

//elimina datos de tracking acumulados
exports.EliminarTracking = function(req, res){
  verficaTokenTRX(req.body.token, req, res, function(req, res) {
    Tracking.remove({}, function(err) {
      if(err){ 
        return handleError(res, err); 
      }
      return res.send(200, constantes.parametros.respuesta_OK);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}