'use strict';

var express = require('express');
var controller = require('./seccion.controller');

var router = express.Router();

//obtiene filtros del menu categorias
router.get('/secciones_principales', controller.getSeccionesPrincipales);

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;