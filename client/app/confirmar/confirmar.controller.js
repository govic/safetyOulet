'use strict';

angular.module('pruebaAngularApp')
  .controller('ConfirmarCtrl', function ($anchorScroll, $timeout, $stateParams, formatCurrency, $state, $scope, Auth, $localStorage, $location, $window, $cookieStore, $http, $filter) {
    $anchorScroll('top');
    var decodedData = window.atob($stateParams.p);
    $scope.loading = false;  
    $scope.productos = [];    
    var u = angular.fromJson(decodedData);
    console.dir(u);
    $scope.show_message = false;
    $scope.error = false;
    var msg_time = 3000;
    
    $scope.accion = u.accion;

    if(u.accion === 'comprar'){
        $scope.productos = $localStorage.carrito_productos;
    }
    if(u.accion === 'cotizar'){
        $scope.productos = $localStorage.cotizacion_producto;
    }

    var id = u._id; 

    if(id){
        if ($cookieStore.get('token')) {
            $http.get('/api/users/me')
            .success(function(user) {  
                //console.log(id);              
                //console.log(user._id);
                if(id !== user._id){                    
                    $state.go('main');
                }
                else{
                    $scope.usuario = u;
                    $scope.carro_local = $localStorage;
                    $scope.total = '$' + formatCurrency.format($scope.carro_local.carrito_total);
                }
            });
        }
    }
    else{
        $scope.usuario = u;
        $scope.carro_local = $localStorage;
        $scope.total = '$' + formatCurrency.format($scope.carro_local.carrito_total);
    }
    
   
    var usuario = {};

    $scope.checkout_local = function() {
        var compra = {
            carrito_cantidad: $localStorage.carrito_cantidad,
            carrito_total: formatCurrency.format($localStorage.carrito_total),
            carrito_productos: $localStorage.carrito_productos,
            carrito_fecha: $filter('date')(Date.now(), 'dd-MM-yyyy')
        };
        var registro_id = Math.floor((Math.random() * 10000) + 1);
        //console.dir(compra);
        //console.dir(registro_id);
        if ($cookieStore.get('token')) {
            $http.get('/api/users/me').success(function(user) {
                usuario = user;
                console.dir(usuario);
                $http.post('api/compras/addcompra', {
                    id_registro: registro_id,
                    usuario: {
                        id_usuario: usuario._id,
                        nombre: usuario.name,
                        correo: usuario.email,
                        datos: $scope.usr
                    },
                    carrito: compra
                }).success(function() {
                    console.dir('borra el localstorage');
                    $localStorage.carrito_productos = [];
                    $localStorage.carrito_cantidad = 0;
                    $localStorage.carrito_total = 0;                        
                    $state.go('compra');
                });
            });
        }
    };

    $scope.checkout = function() {
        //datos checkout
        $scope.loading = true;   
        var checkout = {
            usuario: $scope.usuario, //agrega usuario
            tienda: {},
            productos: $scope.productos
        };
        $http.get('api/tiendas').success(function(tiendas) {
            if(tiendas && tiendas.length > 0 && tiendas[0] && tiendas[0]._id) {
                checkout.tienda = { _id: tiendas[0]._id }; //verificar si debe incluir token //agrega tienda
                console.dir(checkout);
                var checkout_string = JSON.stringify(checkout);
                $http.post('api/servicios/encriptar/checkout', checkout_string).success(function(checkout_encrypt) {
                    $http.post(tiendas[0].url_checkout + '/Checkout/Init', JSON.stringify({
                    //$http.post('http://localhost:49191/Checkout/Init', JSON.stringify({
                        g: checkout_encrypt
                    })).success(function(res){
                        //console.dir(res);
                        if (res.status === 'JSON_CODE_STATUS_ERROR') {
                            $scope.loading = false;
                            $scope.message = res.mensaje;
                            $scope.show_message = true;
                            $scope.error = true;  
                            $timeout(function() {
                                $scope.show_message = false;
                                $scope.error = false;                              
                            }, msg_time);
                            
                        } else {
                            $scope.loading = false;                                                        
                            if(checkout.usuario.accion === 'cotizar'){
                                $localStorage.cotizacion_producto = [];
                                $localStorage.cotizacion_cantidad = 0;
                                console.dir('borra el localstorage');                                
                                $scope.message = 'Cotización realizada con éxito.';
                                $scope.show_message = true;
                                $timeout(function() {
                                    $scope.show_message = false;                            
                                }, msg_time);
                                $state.go('compra', {resultado: 'cotizacion'}); 
                            }
                            if(checkout.usuario.accion === 'comprar'){                                 
                                $localStorage.carrito_productos = [];
                                $localStorage.carrito_cantidad = 0;
                                $localStorage.carrito_total = 0;
                                $scope.message = 'Compra realizada con éxito ... Redirigiendo al sitio de pago.';
                                $scope.show_message = true;                                                              
                                var url = tiendas[0].url_checkout + '/Checkout/Index?q=' + res.q + '&t=' + res.t + '&u=' + res.u;
                                $window.open(url, '_self');                               
                            }                                                       
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
    };
  });
