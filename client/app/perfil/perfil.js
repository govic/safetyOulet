'use strict';

angular.module('pruebaAngularApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('perfil', {
        url: '/perfil/:user_id',
        templateUrl: 'app/perfil/perfil.html',
        controller: 'PerfilCtrl'
      });
  });