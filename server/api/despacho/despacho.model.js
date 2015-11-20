'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var DespachoSchema = new Schema({
	region: String,
	comunas: [{
		comuna: String,
		factor: Number
	}]
});

module.exports = mongoose.model('Despacho', DespachoSchema);
