'use strict';

var _ = require('lodash');
var BannerPrincipal = require('./banner_principal.model');

// Get list of banner_principals
exports.index = function(req, res) {
  BannerPrincipal.find(function (err, banner_principal) {
    if(err) { return handleError(res, err); }
    return res.json(200, banner_principal);
  });
};

// Get a single banner_principal
exports.show = function(req, res) {
  BannerPrincipal.findById(req.params.id, function (err, banner_principal) {
    if(err) { return handleError(res, err); }
    if(!banner_principal) { return res.send(404); }
    return res.json(banner_principal);
  });
};

// Creates a new banner_principal in the DB.
exports.create = function(req, res) {
  BannerPrincipal.create(req.body, function(err, banner_principal) {
    if(err) { return handleError(res, err); }
    return res.json(201, banner_principal);
  });
};

// Updates an existing banner_principal in the DB.
exports.update = function(req, res) {
  
  BannerPrincipal.findById(req.body._id, function (err, banner_principal) {
    if (err) { return handleError(res, err); }
    if(!banner_principal) { return res.send(404); }
    banner_principal.update(req.body, function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, banner_principal);
    });
  });
};

// Deletes a banner_principal from the DB.
exports.destroy = function(req, res) {
  BannerPrincipal.findById(req.params.id, function (err, banner_principal) {
    if(err) { return handleError(res, err); }
    if(!banner_principal) { return res.send(404); }
    banner_principal.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.getBannersPrincipalesActivos = function(req, res) {
  BannerPrincipal
    .find({
      es_activo: true,
      tipo : 'PRIMARIO'
    })
    .sort({orden: 'asc'})
    .exec(function (err, data_banners_principales) {
      if(err) return handleError(res, err);
      return res.json(200, data_banners_principales);
    });
};

exports.getBannersPrincipalesSecundarios = function(req, res) {
  BannerPrincipal
    .find({
      es_activo: true, 
      tipo : 'SECUNDARIO'
    })
    .sort({orden: 'asc'})
    .exec(function (err, data_banners_secundarios) {
      if(err) return handleError(res, err);      
      return res.json(200, data_banners_secundarios);
    });
};

exports.getBannersPrincipalesTerciarios = function(req, res) {
  BannerPrincipal
    .find({
      es_activo: true, 
      tipo : 'TERCIARIO'
    })
    .sort({orden: 'asc'})
    .exec(function (err, data_banners_secundarios) {
      if(err) return handleError(res, err);
      return res.json(200, data_banners_secundarios);
    });
};

function handleError(res, err) {
  return res.send(500, err);
}