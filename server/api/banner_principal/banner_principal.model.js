'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BannerPrincipalSchema = new Schema({
	_id: Number,
	nombre: String,
	descripcion: String,
	texto_alt: String,
	es_activo: Boolean,
	imagen: String,
	orden: Number,
	tipo: String,
	url_filtro: String,
	url_banner: String
});

module.exports = mongoose.model('BannerPrincipal', BannerPrincipalSchema);