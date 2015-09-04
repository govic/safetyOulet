'use strict';

var mongoose = require('mongoose'), Schema = mongoose.Schema;

var ParametrosSchema = new Schema({
  _id: String,
  valor: String
});

module.exports = mongoose.model('Parametros', ParametrosSchema);