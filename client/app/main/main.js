'use strict';

angular.module('pruebaAngularApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        templateUrl: 'app/main/main.html',
        url: '/',
        controller: 'MainCtrl'
      });
  });