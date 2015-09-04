'use strict';

angular.module('pruebaAngularApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('busqueda', {
        url: '/busqueda/:tag',
        templateUrl: 'app/busqueda/busqueda.html',
        controller: 'BusquedaCtrl'
      });
  });