'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TiendaSchema = new Schema({
  _id : Number,
  nombre: String,
  url_manager: String,
  url_checkout: String
});

module.exports = mongoose.model('Tienda', TiendaSchema);