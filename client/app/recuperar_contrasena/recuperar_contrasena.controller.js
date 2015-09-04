'use strict';

angular.module('pruebaAngularApp')
  .controller('RecuperarContrasenaCtrl', function ($anchorScroll, $timeout, $http, $scope) {
    $anchorScroll('top');
    $scope.email = '';
    var recover = {};
    $scope.loading = false;
    $scope.show_message = false;
    $scope.error = false;
    $scope.message = '';
    var msg_time = 3000;

    $scope.recoverPassword = function(){
    	$scope.loading = true;
        $http.post('api/users/finduserbymail', {email: $scope.email}).
        success(function(){
            $http.get('api/tiendas').success(function(tiendas) {
                if(tiendas && tiendas.length > 0 && tiendas[0] && tiendas[0]._id) {
                    recover.id_tienda = tiendas[0]._id;
                    recover.email =  $scope.email;
                    console.dir(recover);
                    var recover_string = JSON.stringify(recover);
                    $http.post('api/servicios/encriptar/checkout', recover_string).success(function(recover_encrypt) {
                        $http.post(tiendas[0].url_checkout + 'ServicioTienda/RecuperarContrasena', JSON.stringify({
                        //$http.post('http://localhost:49191/Checkout/Init', JSON.stringify({
                            r: recover_encrypt
                        })).success(function(res){
                            console.dir(res);
                            if (res.status === 'JSON_CODE_STATUS_OK') {
                                $http.post('api/users/recoverpassword', res.data).
                                success(function(){
                                    $scope.loading = false;                                 
                                    $scope.message = 'Hemos enviado su nueva contraseña a su e-mail.';
                                    $scope.show_message = true;
                                    $timeout(function() {
                                        $scope.show_message = false;                            
                                    }, msg_time);
                                }).
                                error(function(){
                                    $scope.loading = false; 
                                    $scope.message = 'Error.';
                                    $scope.show_message = true;
                                    $scope.error = true;  
                                    $timeout(function() {
                                        $scope.show_message = false;
                                        $scope.error = false;                              
                                    }, msg_time);
                                }); 
                            } else {
                                $scope.loading = false;
                                $scope.message = res.message;
                                $scope.show_message = true;
                                $scope.error = true;  
                                $timeout(function() {
                                    $scope.show_message = false;
                                    $scope.error = false;                              
                                }, msg_time);          
                            }
                        }).error(function(){
                            $scope.loading = false; 
                            $scope.message = 'En estos momentos no podemos procesar su solicitud. Intente de nuevo más tarde.';
                            $scope.show_message = true;
                            $scope.error = true;  
                            $timeout(function() {
                                $scope.show_message = false;
                                $scope.error = false;                              
                            }, msg_time);
                        });
                    });
                }
            }).error(function(err){
                $scope.loading = false;   
                console.log('Error al buscar datos tienda.');
                console.dir(err);
            });
        }).
        error(function(){
            $scope.loading = false; 
            $scope.message = 'El correo ingresado no esta registrado.';
            $scope.show_message = true;
            $scope.error = true;  
            $timeout(function() {
                $scope.show_message = false;
                $scope.error = false;                              
            }, msg_time);
        });
    	
    };
   
  });
