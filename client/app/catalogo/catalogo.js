'use strict';

angular.module('pruebaAngularApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('catalogo', {
        url: '/catalogo/:id_catalogo',
        templateUrl: 'app/catalogo/catalogo.html',
        controller: 'CatalogoCtrl'
      });
  });