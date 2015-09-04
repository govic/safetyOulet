'use strict';

angular.module('pruebaAngularApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('cambiar_contrasena', {
        url: '/cambiar_contrasena/:user_id',
        templateUrl: 'app/cambiar_contrasena/cambiar_contrasena.html',
        controller: 'CambiarContrasenaCtrl'
      });
  });