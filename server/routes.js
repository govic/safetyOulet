/**
 * Main application routes
 */
'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below 
  app.use('/api/cotizacion', require('./api/cotizacion'));
  app.use('/api/trackings', require('./api/tracking'));
  app.use('/api/compras', require('./api/compra'));
  app.use('/api/tiendas', require('./api/tienda'));
  app.use('/api/servicios', require('./api/servicio'));
  app.use('/api/variantes', require('./api/variante'));
  app.use('/api/atributos', require('./api/atributo'));
  
  app.use('/api/seccion', require('./api/seccion'));
  
  app.use('/n', require('./api/banner_principal'));
  app.use('/api/users', require('./api/user'));
  
  //agrega rutas para api productos
  app.use('/api/producto', require('./api/producto'));

  //agrega rutas para api filtros
  app.use('/api/filtros', require('./api/filtro'));

  //agrega rutas para banner principal
  app.use('/api/banner_principal', require('./api/banner_principal'));

  app.use('/auth', require('./auth'));
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
