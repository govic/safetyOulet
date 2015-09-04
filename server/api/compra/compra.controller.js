'use strict';

var _ = require('lodash');
var Compra = require('./compra.model');
var Usuario = require('../user/user.model');
var constantes = require('../../constantes');

// Get list of compras
exports.index = function(req, res) {
  Compra.find(function (err, compras) {
    if(err) { return handleError(res, err); }
    return res.json(200, compras);
  });
};

// Get a single compra
exports.show = function(req, res) {
  Compra.findById(req.params.id, function (err, compra) {
    if(err) { return handleError(res, err); }
    if(!compra) { return res.send(404); }
    return res.json(compra);
  });
};

// Creates a new compra in the DB.
exports.create = function(req, res) {
  Compra.create(req.body, function(err, compra) {
    if(err) { return handleError(res, err); }
    return res.json(201, compra);
  });
};

// Updates an existing compra in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Compra.findById(req.params.id, function (err, compra) {
    if (err) { return handleError(res, err); }
    if(!compra) { return res.send(404); }
    var updated = _.merge(compra, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, compra);
    });
  });
};

// Deletes a compra from the DB.
exports.destroy = function(req, res) {
  Compra.findById(req.params.id, function (err, compra) {
    if(err) { return handleError(res, err); }
    if(!compra) { return res.send(404); }
    compra.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.addCompra = function(req, res, err){

  //console.dir(req.body);
  //borrar carro de usuario
  //Usuario.findById(req.body.usuario.id_usuario, function (err, user){
  Usuario.findById(req.body.usuario._id, function (err, user){

    if(err) return handleError(res, err);
    user.update({carrito: {carrito_cantidad: 0, carrito_total: 0, carrito_productos: []}}, function (err){

      if(err) return handleError(res, err);
      //agrega compra al registro
      Compra.findById(req.body.id_registro, function (err, compra){

        if(err) return handleError(res, err);

        if(compra) {          
          return res.send(400, {"error":"El registro de compra ya existe."});
        } 
        else {
        
          var registro_compra = {
            _id: req.body.id_registro,
            usuario: req.body.usuario,
            compra: req.body.carrito,
            details: false
          };
          //console.dir(registro_compra);
          
          Compra.create(registro_compra, function (err, compra) {           

            if(err) return handleError(res, err);           

            return res.send(200, constantes.parametros.respuesta_OK);
          });
        }
      });
    });
  });
};

exports.findCompras = function(req, res, err){
  console.dir(req.body);
  Compra.find({'usuario._id': req.body.id_usuario}, function(err, compras){
    if(err) return handleError(res, err);
    if(!compras)  return res.send(404, {"error":"No se encontraron compras."});     
    console.dir(compras);
    return res.json(200, compras);
  })
};

function handleError(res, err) {
  return res.send(500, err);
}