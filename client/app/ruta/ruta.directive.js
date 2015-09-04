'use strict';

angular.module('pruebaAngularApp')
  .directive('ruta', function () {
    return {
      templateUrl: 'app/ruta/ruta.html',
      restrict: 'EA',
      link: function () {
      	
      }
    };
  });