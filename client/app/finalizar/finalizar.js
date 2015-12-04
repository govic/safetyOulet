'use strict';

angular.module('pruebaAngularApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('finalizar', {
        url: '/finalizar',
        templateUrl: 'app/finalizar/finalizar.html',
        controller: 'FinalizarCtrl'
      });
  });