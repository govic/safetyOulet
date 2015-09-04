'use strict';

angular.module('pruebaAngularApp')
  .controller('BusquedaCtrl', function ($anchorScroll, $scope, $http, $stateParams) {   
    $anchorScroll('top');
  	 $scope.busqueda = [];
     $scope.tag= [];
     console.log('Inicia buscarProductos('+$scope.tag+')');  
     console.dir($stateParams);   
      
        $http.post('api/producto/busqueda/'+ $stateParams.tag)
          .success(function(data){
            $scope.busqueda = data;
            console.dir($scope.busqueda);

          });
        
  });
