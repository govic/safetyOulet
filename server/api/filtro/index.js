'use strict';

var express = require('express');
var controller = require('./filtro.controller');

var router = express.Router();

//obtiene filtros del menu categorias
router.get('/menu', controller.getFiltrosMenu);
//obtiene filtros laterales a partir de informacion categoria
router.get('/sidebar', controller.getFiltrosLaterales);
//obtiene productos destacados para la categoria consultada a traves del navbar
router.get('/:id/destacados', controller.getDestacadosFiltro);

router.get('/actividades', controller.getActividades);
router.get('/marcas', controller.getMarcas);
router.get('/padres', controller.getFiltrosPadres);
router.get('/pag_principal', controller.getFiltrosPrincipal);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;