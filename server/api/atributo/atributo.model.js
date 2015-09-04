'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AtributoSchema = new Schema({
	_id: Number,
  	nombre_atributo: String,
  	especificacion: [String],    
});

module.exports = mongoose.model('Atributo', AtributoSchema);