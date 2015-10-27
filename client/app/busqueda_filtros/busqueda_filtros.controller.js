'use strict';

angular.module('pruebaAngularApp')
  .controller('BusquedaFiltrosCtrl', function ($scope, $stateParams, $http, formatCurrency) {
    

    var decodedData = window.atob($stateParams.busqueda);   
    var busqueda = angular.fromJson(decodedData);

    console.dir(busqueda);

    $http.post('api/producto/busquedafiltros', {busqueda : busqueda})
    .success(function(data){
      $scope.busqueda = data;
      _.each($scope.busqueda, function(producto){
        producto.precio_format = formatCurrency.format(producto.precio);
      });
      console.dir(data);
    });
  });
