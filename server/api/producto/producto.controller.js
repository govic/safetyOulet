'use strict';

var _ = require('lodash');
var Producto = require('./producto.model');
var Atributo = require('../atributo/atributo.model');

// Get list of productos
exports.index = function(req, res) {
  Producto.find(function (err, productos) {
    if(err) { return handleError(res, err); }
    return res.json(200, productos);
  });
};

// Get a single producto
exports.show = function(req, res) {
  Producto.findById(req.params.id, function (err, producto) {
    if(err) { return handleError(res, err); }
    if(!producto) { return res.send(404); }
    return res.json(producto);
  });
};

// Creates a new producto in the DB.
exports.create = function(req, res) {
  Producto.create(req.body, function(err, producto) {
    if(err) { return handleError(res, err); }    
    return res.json(201, producto);
  });
};

// Updates an existing producto in the DB.
exports.update = function(req, res) {
  
  Producto.findById(req.body._id, function (err, producto) {
    if (err) { 
      return handleError(res, err); 
    }
    if(!producto) { 
      return res.send(404); 
    }
    producto.update(req.body, function (err) {
      if (err) { 
        return handleError(res, err); 
      }
      return res.json(200, producto);
    });
  });
};

// Deletes a producto from the DB.
exports.destroy = function(req, res) {
  Producto.findById(req.params.id, function (err, producto) {
    if(err) { return handleError(res, err); }
    if(!producto) { return res.send(404); }
    producto.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

//obtiene productos segun query filtros
exports.getProductosByQuery = function(req, res){
  var filtros = [];
  exports.producto = [];
  
  //obtiene lista de filtros
  if (req.body && req.body.length !== 0){
    filtros = req.body;    
  }
  console.dir(filtros);

  if(filtros && filtros.length !== 0){
    exports.producto = Producto.find({      
      'filtros._id': {
        $in: filtros //busca segun filtros
      },
      active: true //retorna solo productos activos

    }, function(err, productos){
      //si ocurre un error en el servidor
      if(err) { return handleError(res, err); }

      //si no existen errores, envia lista de productos
      return res.json(200, productos);
    });
  } else {
    return res.json(200, []);
  }
};


exports.getProductosByAtributos = function(req, res){
  var atributos = [];

  //obtiene lista de filtros
  if (req.body && req.body.length !== 0){
    atributos = req.body;    
  }
  //console.dir(atributos);
  if(atributos && atributos.length !== 0){
    exports.producto.find({      
      'atributos.especificacion': {
        $all: atributos
      },
      active: true //retorna solo productos activos

    }, function(err, productos){
      //si ocurre un error en el servidor
      if(err) { return handleError(res, err); }

      //si no existen errores, envia lista de productos
      return res.json(200, productos);
    });
  } else {
    return res.json(200, []);
  }
};

exports.getProductosRelacionados = function(req, res){

  //busca producto especifico
  Producto.findById(req.params.id, function (err, producto) {
    
    if(err) { return handleError(res, err); }
    if(!producto) { return res.send(404); } 
    //busca filtros asociados a producto
    if (producto.productos_rel && producto.productos_rel.length !== 0){
      Producto.find({
        '_id': { 
          $in: producto.productos_rel //busca para todos los id de filtro
        }
      }, function(err, data){
        
        if(err) { return handleError(res, err); }
        //retorna lista de objetos filtro
        return res.json(data);
      });      
    }
  });
};

exports.getAtributosProducto = function(req, res){

  //busca producto especifico
  Producto.findById(req.params.id, function (err, producto) {
    
    if(err) { return handleError(res, err); }
    if(!producto) { return res.send(404); }

    //busca filtros asociados a producto
    if (producto.atributos && producto.atributos.length !== 0){
      Atributo.find({
        '_id': { 
          $in: producto.atributos //busca para todos los id de filtro
        }
      }, function(err, atributos){
        
        if(err) { return handleError(res, err); }

        //retorna lista de objetos filtro
        return res.json(atributos);
      });
    }
  });
};

exports.getProductosBySeccion = function(req, res){
  //obtiene obj seccion .. datos query y maximos
  var seccion = req.body;  
  //console.dir(seccion);
  //verifica datos para hacer consulta
  if (seccion && seccion.maximo_item && seccion.maximo_item !== 0 && seccion.query && seccion.query.length !== 0){    
    Producto
      .find({
        'filtros._id': {
          $in: seccion.query //busca segun filtros de seccion
        },
        active: true //retorna solo productos activos
      })
      .limit(seccion.maximo_item)//agrega limite de registros que retorna
      .exec(function(err, productos){
        //controla error en consulta
        if (err) { return handleError(res, req); }
        //retorna productos obtenidos para la seccion
        return res.json(200, productos);
      });
  } else {
    //si no estan los datos para hacer la query .. retorna vacio, sin error
    return res.json(200, []);
  }
};

exports.getProductosBusqueda = function(req, res){

  Producto.textSearch(req.params.tag, function(err, data){
    //captura error
    if (err) return handleError(err);
    //retorna resultados
    return res.json(200, _.map(data.results, function(item){ return item.obj }));
  });
};
exports.getRangoPrecios = function(req, res){
  var precios = [];
  Producto.findOne().where({active:true}).sort('precio').exec(function(err,doc){
    if (err) { return handleError(res, req); }
    if(!doc) { return res.send(404); } 

    precios.push(doc.precio);

    Producto.findOne().where({active:true}).sort('-precio').exec(function(err,doc){
      if (err) { return handleError(res, req); }
      if(!doc) { return res.send(404); } 

      precios.push(doc.precio);

      return res.json(200, precios);
    });    
  });
};

function handleError(res, err) {
  return res.send(500, err);
}