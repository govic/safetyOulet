'use strict';

angular.module('pruebaAngularApp')
  .controller('SignupCtrl', function ($scope, Auth, $location, $window) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {        
        Auth.createUser({          
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password,
          carrito: {
                      carrito_productos: '', //json con productos
                      carrito_cantidad: 0, // cantidad de productos .. cuenta todos los productos
                      carrito_total: 0 //total precios .. todos los productos
                    }  
        })
        .then( function() {
          // Account created, redirect to home          
          $location.path('/');

        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
