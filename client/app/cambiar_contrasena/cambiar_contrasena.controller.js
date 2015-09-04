'use strict';

angular.module('pruebaAngularApp')
  .controller('CambiarContrasenaCtrl', function ($anchorScroll, $stateParams, $http, $scope, $cookieStore, $timeout, $state) {   
    $anchorScroll('top');
    $scope.user = {};
    $scope.show_message = false;
    $scope.error = false;
    $scope.message = '';
    var msg_time = 3000;

    var decodedData = window.atob($stateParams.user_id);   
    var user_id = angular.fromJson(decodedData);
    console.dir(user_id);    

    if ($cookieStore.get('token')) {
        $http.get('/api/users/me')
        .success(function(user) {
            if(user_id === user._id){
                $scope.usuario = user;
                console.dir($scope.usuario);
            }
            else{
                $state.go('main');
            }            
        });
    }
    else{
        $state.go('main');
    }  

    $scope.changePassword = function(form){
        if(form.$valid){
            if($scope.user.newPassword === $scope.user.newPassword2){
                $scope.usuario.oldPassword = $scope.user.oldPassword;
                $scope.usuario.newPassword = $scope.user.newPassword;
                $http.put('api/users/' + $scope.usuario._id + '/password', $scope.usuario)
                .success(function(){
                    $scope.message = 'Su contraseña se ha cambiado con éxito.';
                    $scope.show_message = true;                 
                    $timeout(function() {
                        $scope.show_message = false;
                        var usuario_id_json = angular.toJson($scope.usuario._id);
                        var encodedData = window.btoa(usuario_id_json);
                        $state.go('perfil', {user_id: encodedData});                            
                    }, msg_time);
                })
                .error(function(){
                    $scope.message = 'La contraseña actual no es correcta.';
                    $scope.show_message = true;
                    $scope.error = true;                
                    $timeout(function() {
                        $scope.error = false;
                        $scope.show_message = false;                            
                    }, msg_time);
                });
            }
            else{
                $scope.message = 'Las contraseñas no coinciden';
                $scope.show_message = true;
                $scope.error = true;                
                $timeout(function() {
                    $scope.error = false;
                    $scope.show_message = false;                            
                }, msg_time);
            }
        }
    };
  });
