/*

20-11-2015
Codigo copiado de tienda HW para implementacion sincronizacion costos despacho

*/
'use strict';

var _ = require('lodash');
var Despacho = require('./despacho.model');

//obtiene lista de regiones y comunas que tienen configuracion despacho
exports.index = function(req, res) {
  Despacho.find().lean().exec(function (err, data) {
    if(err) { return handleError(res, err); }
    return res.json(200, data);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}