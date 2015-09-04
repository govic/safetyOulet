'use strict';

angular.module('pruebaAngularApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('confirmar', {
        url: '/confirmar/:p',
        templateUrl: 'app/confirmar/confirmar.html',
        controller: 'ConfirmarCtrl'
      });
  });