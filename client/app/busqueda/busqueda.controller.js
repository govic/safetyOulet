'use strict';

angular.module('pruebaAngularApp')
  .controller('BusquedaCtrl', function ($anchorScroll, $scope, $http, $stateParams, formatCurrency) {   
    $anchorScroll('top');
    $scope.busqueda = [];
    $scope.tag = [];
    $stateParams.tag = $stateParams.tag || '';
    console.log('Inicia buscarProductos('+$stateParams+')');  
    console.dir($stateParams.tag); 

    $scope.tag = $stateParams.tag.toString().split(' ');
    console.dir($scope.tag);

    $http.post('api/producto/busqueda', {tags : $scope.tag})
    .success(function(data){
      $scope.busqueda = data;
      _.each($scope.busqueda, function(producto){
        producto.precio_format = formatCurrency.format(producto.precio);
      });
      console.dir(data);
    });
  });
