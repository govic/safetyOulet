'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CotizacionSchema = new Schema({
  _id: Number,
  usuario: {},
  cotizacion: {},
  details: Boolean
});

module.exports = mongoose.model('Cotizacion', CotizacionSchema);