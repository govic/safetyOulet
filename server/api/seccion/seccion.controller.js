'use strict';

var _ = require('lodash');
var Seccion = require('./seccion.model');

// Get list of seccions
exports.index = function(req, res) {
  Seccion.find(function (err, seccions) {
    if(err) { return handleError(res, err); }
    return res.json(200, seccions);
  });
};

// Get a single seccion
exports.show = function(req, res) {
  Seccion.findById(req.params.id, function (err, seccion) {
    if(err) { return handleError(res, err); }
    if(!seccion) { return res.send(404); }
    return res.json(seccion);
  });
};

// Creates a new seccion in the DB.
exports.create = function(req, res) {
  Seccion.create(req.body, function(err, seccion) {
    if(err) { return handleError(res, err); }
    return res.json(201, seccion);
  });
};

// Updates an existing seccion in the DB.
exports.update = function(req, res) {

  Seccion.findById(req.body._id, function (err, seccion) {
    if (err) { return handleError(res, err); }
    if(!seccion) { return res.send(404); }
    seccion.update(req.body, function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, seccion);
    });
  });
};

// Deletes a seccion from the DB.
exports.destroy = function(req, res) {
  Seccion.findById(req.params.id, function (err, seccion) {
    if(err) { return handleError(res, err); }
    if(!seccion) { return res.send(404); }
    seccion.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

//obtiene secciones principales para cargar en vista
exports.getSeccionesPrincipales = function(req, res){
  //busca todas las secciones que se mostraran en la pagina principal
  Seccion
    .find({
      es_pagina_principal: true
    })
    .sort({orden: 'asc'})
    .exec(function (err, data_secciones) {
      if(err) return handleError(res, err);
      return res.json(200, data_secciones);
    });
};

function handleError(res, err) {
  return res.send(500, err);
}