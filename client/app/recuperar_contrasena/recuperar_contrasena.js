'use strict';

angular.module('pruebaAngularApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('recuperar_contrasena', {
        url: '/recuperar_contrasena',
        templateUrl: 'app/recuperar_contrasena/recuperar_contrasena.html',
        controller: 'RecuperarContrasenaCtrl'
      });
  });