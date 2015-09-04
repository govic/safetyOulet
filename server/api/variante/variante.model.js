'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var VarianteSchema = new Schema({
	_id: Number,
  nombre: String,
  activo: Boolean,
  valores: [],
  
});

module.exports = mongoose.model('Variante', VarianteSchema);