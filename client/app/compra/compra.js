'use strict';

angular.module('pruebaAngularApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('compra', {
        url: '/compra/:resultado',
        templateUrl: 'app/compra/compra.html',
        controller: 'CompraCtrl'
      });
  });