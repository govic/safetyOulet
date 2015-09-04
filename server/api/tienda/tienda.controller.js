'use strict';

var _ = require('lodash');
var Tienda = require('./tienda.model');

// Get list of tiendas
exports.index = function(req, res) {
  Tienda.find(function (err, tiendas) {
    if(err) { return handleError(res, err); }
    return res.json(200, tiendas);
  });
};

// Get a single tienda
exports.show = function(req, res) {
  Tienda.findById(req.params.id, function (err, tienda) {
    if(err) { return handleError(res, err); }
    if(!tienda) { return res.send(404); }
    return res.json(tienda);
  });
};

// Creates a new tienda in the DB.
exports.create = function(req, res) {
  Tienda.create(req.body, function(err, tienda) {
    if(err) { return handleError(res, err); }
    return res.json(201, tienda);
  });
};

// Updates an existing tienda in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Tienda.findById(req.params.id, function (err, tienda) {
    if (err) { return handleError(res, err); }
    if(!tienda) { return res.send(404); }
    var updated = _.merge(tienda, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, tienda);
    });
  });
};

// Deletes a tienda from the DB.
exports.destroy = function(req, res) {
  Tienda.findById(req.params.id, function (err, tienda) {
    if(err) { return handleError(res, err); }
    if(!tienda) { return res.send(404); }
    tienda.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}