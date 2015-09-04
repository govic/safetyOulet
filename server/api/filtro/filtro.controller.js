'use strict';

var _ = require('lodash');
var Filtro = require('./filtro.model');
var Producto = require('../producto/producto.model');

// Get list of filtros
exports.index = function(req, res) {
  Filtro.find(function (err, filtros) {
    if(err) { return handleError(res, err); }
    return res.json(200, filtros);
  });
};

// Get a single filtro
exports.show = function(req, res) {
  Filtro.findById(req.params.id, function (err, filtro) {
    if(err) { return handleError(res, err); }
    if(!filtro) { return res.send(404); }
    return res.json(filtro);
  });
};

// Creates a new filtro in the DB.
exports.create = function(req, res) {
  Filtro.create(req.body, function(err, filtro){    
    if(err) { return handleError(res, err); }
    return res.json(201, filtro);    
  });
};

// Updates an existing filtro in the DB.
exports.update = function(req, res) {

  Filtro.findById(req.body._id, function (err, filtro) {
    if (err) { return handleError(res, err); }
    if(!filtro) { return res.send(404); }
    filtro.update(req.body, function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, filtro);
    });
  });
};

// Deletes a filtro from the DB.
exports.destroy = function(req, res) {
  Filtro.findById(req.params.id, function (err, filtro) {
    if(err) { return handleError(res, err); }
    if(!filtro) { return res.send(404); }
    filtro.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

//obtiene filtros del menu
exports.getFiltrosMenu = function(req, res) {

  //busca filtros que son categoria en menu
  Filtro.find({
    es_menu_filtro: true,
    es_activo_filtro: false    
  }, function (err, filtros) {
    if(err) return handleError(res, err);
    return res.json(200, filtros);
  });
};

exports.getFiltrosPrincipal = function (req, res){
  Filtro.find({
    en_pag_principal: true  
  }, function(err, filtros){
    if(err) return handleError(res, err);
    return res.json(200, filtros);
  });
};

//obtiene filtros laterales a partir de filtros menu
exports.getFiltrosLaterales = function(req, res) {
  //busca todos los filtros que sean categoria o filtro activo
  Filtro.find({
    $or:[
      { es_menu_filtro: true },
      { es_activo_filtro: true }
    ]
  }, function (err, filtros) {
    if(err) { return handleError(res, err); }
    return res.json(200, filtros);
  }); 
};


exports.getDestacadosFiltro = function(req, res) {

  var filtro = '';  
  //obtiene lista de filtros
  filtro = req.params.id; //filtro = id de categoria  
  
  if(filtro){
    Producto.find({      
      'filtros._id': filtro, // busca los prodcutos que posean en sus filtros la categoria      
      active: true, //retorna solo productos activos
      es_destacado_categoria: true //retorna solo los destacados

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

exports.getActividades = function(req, res) {
  Filtro.find({
    tipo: 'ACTIVIDAD'  
  }, function (err, filtros){
    if(err) return handleError(res, err);
    return res.json(200, filtros);
  });
};

exports.getMarcas = function(req, res) {
  Filtro.find({
    tipo: 'MARCA'  
  }, function (err, filtros){
    if(err) return handleError(res, err);
    return res.json(200, filtros);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}