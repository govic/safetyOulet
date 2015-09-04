'use strict';

var express = require('express');
var controller = require('./banner_principal.controller');

var router = express.Router();

//obtiene los banners principales en estado activo
router.get('/activos', controller.getBannersPrincipalesActivos);
router.get('/secundarios', controller.getBannersPrincipalesSecundarios);
router.get('/terciarios', controller.getBannersPrincipalesTerciarios);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;