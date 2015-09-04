'use strict';

var _ = require('lodash');
var Cotizacion = require('./cotizacion.model');
var Usuario = require('../user/user.model');
var constantes = require('../../constantes');

// Get list of cotizacions
exports.index = function(req, res) {
  Cotizacion.find(function (err, cotizacions) {
    if(err) { return handleError(res, err); }
    return res.json(200, cotizacions);
  });
};

// Get a single cotizacion
exports.show = function(req, res) {
  Cotizacion.findById(req.params.id, function (err, cotizacion) {
    if(err) { return handleError(res, err); }
    if(!cotizacion) { return res.send(404); }
    return res.json(cotizacion);
  });
};

// Creates a new cotizacion in the DB.
exports.create = function(req, res) {
  Cotizacion.create(req.body, function(err, cotizacion) {
    if(err) { return handleError(res, err); }
    return res.json(201, cotizacion);
  });
};

// Updates an existing cotizacion in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Cotizacion.findById(req.params.id, function (err, cotizacion) {
    if (err) { return handleError(res, err); }
    if(!cotizacion) { return res.send(404); }
    var updated = _.merge(cotizacion, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, cotizacion);
    });
  });
};

// Deletes a cotizacion from the DB.
exports.destroy = function(req, res) {
  Cotizacion.findById(req.params.id, function (err, cotizacion) {
    if(err) { return handleError(res, err); }
    if(!cotizacion) { return res.send(404); }
    cotizacion.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.addCotizacion = function(req, res, err){

  //console.dir(req.body);
  //borrar carro de usuario
  //Usuario.findById(req.body.usuario.id_usuario, function (err, user){
    Usuario.findById(req.body.usuario._id, function (err, user){

    if(err) return handleError(res, err);   
    user.update({cotizacion: {cotizacion_cantidad: 0, cotizacion_producto: []}}, function (err){

      if(err) return handleError(res, err);
      //agrega cotizacion al registro
      Cotizacion.findById(req.body.id_registro, function (err, cotizacion){

        if(err) return handleError(res, err);

        if(cotizacion) {          
          return res.send(400, {"error":"El registro de cotizacion ya existe."});
        } 
        else {
        
          var registro_cotizacion = {
            _id: req.body.id_registro,
            usuario: req.body.usuario,
            cotizacion: req.body.carrito,
            details: false
          };
          //console.dir(registro_cotizacion);
          
          Cotizacion.create(registro_cotizacion, function (err, cotizacion) {           

            if(err) return handleError(res, err);           

            return res.send(200, constantes.parametros.respuesta_OK);
          });
        }
      });
    });
  });
};

exports.findCotizacion = function(req, res, err){
  //console.dir(req.body);
  Cotizacion.find({'usuario._id': req.body.id_usuario}, function(err, cotizaciones){
    if(err) return handleError(res, err);
    if(!cotizaciones)  return res.send(404, {"error":"No se encontraron cotizaciones."});     
    console.dir(cotizaciones);
    return res.json(200, cotizaciones);
  })
};

function handleError(res, err) {
  return res.send(500, err);
}