'use strict';

var _ = require('lodash');
var Atributo = require('./atributo.model');

// Get list of atributos
exports.index = function(req, res) {
  Atributo.find(function (err, atributos) {
    if(err) { return handleError(res, err); }
    return res.json(200, atributos);
  });
};

// Get a single atributo
exports.show = function(req, res) {
  Atributo.findById(req.params.id, function (err, atributo) {
    if(err) { return handleError(res, err); }
    if(!atributo) { return res.send(404); }
    return res.json(atributo);
  });
};

// Creates a new atributo in the DB.
exports.create = function(req, res) {
  Atributo.create(req.body, function(err, atributo) {
    if(err) { return handleError(res, err); }
    return res.json(201, atributo);
  });
};

// Updates an existing atributo in the DB.
exports.update = function(req, res) {
  
  Atributo.findById(req.body._id, function (err, atributo) {
    if (err) { return handleError(res, err); }
    if(!atributo) { return res.send(404); }

    atributo.update(req.body, function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, atributo);
    });
  });
};

// Deletes a atributo from the DB.
exports.destroy = function(req, res) {
  Atributo.findById(req.params.id, function (err, atributo) {
    if(err) { return handleError(res, err); }
    if(!atributo) { return res.send(404); }
    atributo.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}