'use strict';

var mongoose = require('mongoose'),
Schema = mongoose.Schema,
textSearch = require('mongoose-text-search');

var ProductoSchema = new Schema({	
	_id: Number,
	nombre: String,
	descripcion: String,
	descripcion_larga: String,
	precio: Number,
	filtros: [],
	atributos: [],	
	productos_rel: [],
	active: Boolean,
	images: [String],
	variantes: [],
	tag: {type:[], lowercase: true},
	es_destacado_categoria: Boolean,
	stock: [],
	documentos:[]
});

ProductoSchema.plugin(textSearch);
ProductoSchema.index({tag: 'text'});


module.exports = mongoose.model('Producto', ProductoSchema);