'use strict';

var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var FiltroSchema = new Schema({	
	_id: Number,
	glosa_filtro: String,
	descripcion_filtro: String,
	es_menu_filtro: {type:Boolean, default: false},
	en_pag_principal : {type:Boolean, default: false},
	dependencias_filtro: [],
	es_activo_filtro: {type:Boolean, default: false},
	imagen: String,
	urlBanner: [],
	tipo: String
});

module.exports = mongoose.model('Filtro', FiltroSchema);