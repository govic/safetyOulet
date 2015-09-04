'use strict';

angular.module('pruebaAngularApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('informacion', {
        url: '/informacion',
        templateUrl: 'app/informacion/informacion.html',
        controller: 'InformacionCtrl'
      });
  });