'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TrackingSchema = new Schema({ 
	usuario_id: String,  
	usuario_nombre: String, 
	usuario_correo: String,
	usuario_tipo: String,
  	id_elemento: Number,
  	tipo_elemento: String,
  	elemento: String,
  	fecha: Date
});

module.exports = mongoose.model('Tracking', TrackingSchema);