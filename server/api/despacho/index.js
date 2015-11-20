/*

20-11-2015 Hector Fuentes
Codigo copiado desde tienda HW para sincronizacion de costos despacho

*/
'use strict';

var express = require('express');
var controller = require('./despacho.controller');

var router = express.Router();

router.get('/', controller.index);

module.exports = router;