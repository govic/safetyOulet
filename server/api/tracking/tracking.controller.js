'use strict';

var _ = require('lodash');
var Tracking = require('./tracking.model');

// Get list of trackings
exports.index = function(req, res) {
  Tracking.find(function (err, trackings) {
    if(err) { return handleError(res, err); }
    return res.json(200, trackings);
  });
};

// Get a single tracking
exports.show = function(req, res) {
  Tracking.findById(req.params.id, function (err, tracking) {
    if(err) { return handleError(res, err); }
    if(!tracking) { return res.send(404); }
    return res.json(tracking);
  });
};

// Creates a new tracking in the DB.
exports.create = function(req, res) {
  Tracking.create(req.body, function(err, tracking) {
    if(err) { return handleError(res, err); }
    return res.json(201, tracking);
  });
};

// Updates an existing tracking in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Tracking.findById(req.params.id, function (err, tracking) {
    if (err) { return handleError(res, err); }
    if(!tracking) { return res.send(404); }
    var updated = _.merge(tracking, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, tracking);
    });
  });
};

// Deletes a tracking from the DB.
exports.destroy = function(req, res) {
  Tracking.findById(req.params.id, function (err, tracking) {
    if(err) { return handleError(res, err); }
    if(!tracking) { return res.send(404); }
    tracking.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}