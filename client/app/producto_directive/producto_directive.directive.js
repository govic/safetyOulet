'use strict';

angular.module('pruebaAngularApp')
  .directive('productoDirective', function () {
    return {    	
      templateUrl: 'app/producto_directive/producto_directive.html',
      restrict: 'E',
      link: function () {
      	console.log('Inicia Producto Directive ...');
      }
    };
  });