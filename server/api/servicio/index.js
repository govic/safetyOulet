/*

20-11-2015 Hector Fuentes
Agregar ruta sincronizacion costos de envio, copiado de tienda HW


*/
'use strict';

var express = require('express');
var controller = require('./servicio.controller');

var router = express.Router();

router.post('/filtros/add', controller.addFiltro);
router.post('/filtros/remove', controller.removeFiltro);

router.post('/secciones/add', controller.addSeccion);
router.post('/secciones/remove', controller.removeSeccion);

router.post('/productos/add', controller.addProducto);
router.post('/productos/remove', controller.removeProducto);
router.post('/productos/stock', controller.UpdateStock);

router.post('/banner_principal/add', controller.addBannerPrincipal);
router.post('/banner_principal/remove', controller.removeBannerPrincipal);

router.post('/imagenes/add', controller.addImagen);
router.post('/imagenes/remove', controller.removeImagen);

router.post('/tienda/add', controller.addTienda);

//ruta para acceder a cambio token de transacciones
router.post('/tienda/token', controller.tokenTienda);

//solicta tracking
router.post('/trackings/solicitar', controller.SolicitarTracking);
router.post('/trackings/eliminar', controller.EliminarTracking);

//encripta contenido del checkout
router.post('/encriptar/checkout', controller.EncriptarCheckout);

//recibe documentos de producto
router.post('/documentos/add', controller.addDocuments);

//elimina documentos de producto
router.post('/documentos/remove', controller.removeDocuments);

//ruta para metodo que sincroniza tabla factores para calculo costo despacho
router.post('/costo_despacho/sync', controller.updateCostosDespacho);

module.exports = router;
