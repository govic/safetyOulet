'use strict';

angular.module('pruebaAngularApp')
  .directive('productoCatalogo', function () {
    return {
      templateUrl: 'app/producto_catalogo/producto_catalogo.html',
      restrict: 'E',
      link: function () {
      	
      }
    };
  });