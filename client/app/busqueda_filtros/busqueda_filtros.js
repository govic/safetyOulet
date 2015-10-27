'use strict';

angular.module('pruebaAngularApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('busqueda_filtros', {
        url: '/busqueda_filtros/:busqueda',
        templateUrl: 'app/busqueda_filtros/busqueda_filtros.html',
        controller: 'BusquedaFiltrosCtrl'
      });
  });