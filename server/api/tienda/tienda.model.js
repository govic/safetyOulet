/*

23-11-2015 Hector Fuentes
agrego configuracion de tipos de medios de pago que permite la tienda, copiado desde HW

*/
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TiendaSchema = new Schema({
  _id : Number,
  nombre: String,
  url_manager: String,
  url_checkout: String,
  //indica medios de pago disponibles en la tienda
  permite_webpay: Boolean,
  permite_khipu: Boolean,
  permite_transferencia: Boolean,
  permite_credito: Boolean,
  //indica si la tienda permite hacer cotizaciones
  permite_cotizacion: Boolean
});

module.exports = mongoose.model('Tienda', TiendaSchema);