'use strict';

var express = require('express');
var controller = require('./producto.controller');

var router = express.Router();

//obtiene lista de productos segun query filtros
router.post('/query', controller.getProductosByQuery);
router.post('/atr', controller.getProductosByAtributos);

router.get('/:id/relacionados', controller.getProductosRelacionados);
//obtiene lista de productos segun query de la seccion
router.post('/query_seccion', controller.getProductosBySeccion);

router.get('/:id/atributos', controller.getAtributosProducto);
router.post('/busqueda', controller.getProductosBusqueda);
router.post('/getpreciosminmax', controller.getRangoPrecios);
router.post('/busquedafiltros', controller.getProductosBusquedaFiltros);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;