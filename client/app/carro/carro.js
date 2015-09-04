'use strict';

angular.module('pruebaAngularApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('carro', {
        url: '/carro',
        templateUrl: 'app/carro/carro.html',
        controller: 'CarroCtrl'
      });
  });