'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CompraSchema = new Schema({
  _id: Number,
  usuario: {},
  compra: {},
  details: Boolean
});

module.exports = mongoose.model('Compra', CompraSchema);