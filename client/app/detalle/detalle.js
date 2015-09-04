'use strict';

angular.module('pruebaAngularApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('detalle', {
        url: '/detalle/:id_producto',
        templateUrl: 'app/detalle/detalle.html',
        controller: 'DetalleCtrl'
      });
  });