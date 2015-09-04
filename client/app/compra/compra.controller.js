'use strict';

angular.module('pruebaAngularApp')
  .controller('CompraCtrl', function ($anchorScroll, $stateParams, $scope, $window, $localStorage, $location) {
    $anchorScroll('top');
    $scope.Ok = function(){    	 
    	$location.path('/');
    };
    $scope.resultado = $stateParams.resultado;
  });
