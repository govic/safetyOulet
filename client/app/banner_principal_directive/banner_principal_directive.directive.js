'use strict';

angular.module('pruebaAngularApp')
  .directive('bannerPrincipalDirective', function () {
    return {
      templateUrl: 'app/banner_principal_directive/banner_principal_directive.html',
      restrict: 'E',     
      link: function (scope) {
      	console.log('Inicia .. bannerPrincipalDirective');
      	scope.intervalo_ms = 500;
      }
    };
  });