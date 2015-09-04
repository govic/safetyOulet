'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SeccionSchema = new Schema({
  _id: Number,
  codigo: String,
  maximo_item: Number,
  vista_item: Number,
  query: [Number],
  titulo: String,
  descripcion: String,
  es_pagina_principal: Boolean,
  orden: Number
});

module.exports = mongoose.model('Seccion', SeccionSchema);