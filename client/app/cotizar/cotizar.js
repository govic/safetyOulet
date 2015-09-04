'use strict';

angular.module('pruebaAngularApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('cotizar', {
        url: '/cotizar',
        templateUrl: 'app/cotizar/cotizar.html',
        controller: 'CotizarCtrl'
      });
  });