'use strict';

var _ = require('lodash');
var Variante = require('./variante.model');

// Get list of variantes
exports.index = function(req, res) {
  Variante.find(function (err, variantes) {
    if(err) { return handleError(res, err); }
    return res.json(200, variantes);
  });
};

// Get a single variante
exports.show = function(req, res) {
  Variante.findById(req.params.id, function (err, variante) {
    if(err) { return handleError(res, err); }
    if(!variante) { return res.send(404); }
    return res.json(variante);
  });
};

// Creates a new variante in the DB.
exports.create = function(req, res) {
  Variante.create(req.body, function(err, variante) {
    if(err) { return handleError(res, err); }
    return res.json(201, variante);
  });
};

// Updates an existing variante in the DB.
exports.update = function(req, res) {
  
  Variante.findById(req.body._id, function (err, variante) {
    if (err) { return handleError(res, err); }
    if(!variante) { return res.send(404); }
    variante.update(req.body, function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, variante);
    });
  });
};

// Deletes a variante from the DB.
exports.destroy = function(req, res) {
  Variante.findById(req.params.id, function (err, variante) {
    if(err) { return handleError(res, err); }
    if(!variante) { return res.send(404); }
    variante.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}