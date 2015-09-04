'use strict';

angular.module('pruebaAngularApp')
    .controller('CarroCtrl', function ($anchorScroll, $scope, $http, $localStorage, carroService, formatCurrency, $state){
        //console.dir($localStorage);
        $anchorScroll('top');  
        $scope.carro = $localStorage;  
        $scope.sobrestock = false; 
        console.dir($scope.carro.carrito_productos);        

        var finalizar = function(productos){
            var sobrestocks = [];
            _.each(productos, function(producto){            
                console.dir(producto.sobrestock);
                if(producto.sobrestock === true){
                    sobrestocks.push(true);
                }else{
                    sobrestocks.push(false);
                }          
            });
            if(_.contains(sobrestocks, true)){
                $scope.sobrestock = true; 
            }    
            else{
                $scope.sobrestock = false;
            }
        };

        _.each($scope.carro.carrito_productos, function(producto){
            if(producto.cantidad > producto.stock){
                producto.sobrestock = true;                              
            }
            else{
                producto.sobrestock = false;              
            }
        }); 
        finalizar($localStorage.carrito_productos);
        
        $scope.removeCarro = function(producto){
          carroService.remove(producto);
          finalizar($localStorage.carrito_productos);
        };  

        //verifica que cantidad comprada sea menor al stock del producto dependiendo la combinación de variantes
        $scope.cambiaCantidad = function(index, valor){
            var cantidad = $localStorage.carrito_productos[index].cantidad;         
            //console.dir(index);
            if(cantidad >= 1 && valor){             
                $localStorage.carrito_productos[index].cantidad = cantidad + 1;
                $localStorage.carrito_productos[index].precio_total = $localStorage.carrito_productos[index].cantidad * $localStorage.carrito_productos[index].precio_unitario;
                //formatea miles
                $localStorage.carrito_productos[index].precio_unitario_formato = _.clone($localStorage.carrito_productos[index].precio_unitario);
                $localStorage.carrito_productos[index].precio_unitario_formato = formatCurrency.format($localStorage.carrito_productos[index].precio_unitario_formato);
                $localStorage.carrito_productos[index].precio_total_formato = _.clone($localStorage.carrito_productos[index].precio_total);
                $localStorage.carrito_productos[index].precio_total_formato = formatCurrency.format($localStorage.carrito_productos[index].precio_total);

                $localStorage.carrito_cantidad = $localStorage.carrito_cantidad + 1;
                $localStorage.carrito_total = $localStorage.carrito_total + $localStorage.carrito_productos[index].precio_unitario;
                if($localStorage.carrito_productos[index].cantidad > $localStorage.carrito_productos[index].stock){
                    $localStorage.carrito_productos[index].sobrestock = true;          
                }
                else{
                    $localStorage.carrito_productos[index].sobrestock = false;
                }                
            }
            if(cantidad > 1 && !valor){
                $localStorage.carrito_productos[index].cantidad = cantidad - 1;
                $localStorage.carrito_productos[index].precio_total = $localStorage.carrito_productos[index].cantidad * $localStorage.carrito_productos[index].precio_unitario;

                //formatea miles
                $localStorage.carrito_productos[index].precio_unitario_formato = _.clone($localStorage.carrito_productos[index].precio_unitario);
                $localStorage.carrito_productos[index].precio_unitario_formato = formatCurrency.format($localStorage.carrito_productos[index].precio_unitario_formato);
                $localStorage.carrito_productos[index].precio_total_formato = _.clone($localStorage.carrito_productos[index].precio_total);
                $localStorage.carrito_productos[index].precio_total_formato = formatCurrency.format($localStorage.carrito_productos[index].precio_total);

                $localStorage.carrito_cantidad = $localStorage.carrito_cantidad - 1;
                $localStorage.carrito_total = $localStorage.carrito_total - $localStorage.carrito_productos[index].precio_unitario; 
                if($localStorage.carrito_productos[index].cantidad > $localStorage.carrito_productos[index].stock){
                    $localStorage.carrito_productos[index].sobrestock = true;                                     
                } 
                else{
                    $localStorage.carrito_productos[index].sobrestock = false;  
                }
            } 
            finalizar($localStorage.carrito_productos);                                 
        };

        $scope.goToCheckout = function(){
            $state.go('checkout', {accion: 'comprar'});
        }; 

        $http.get('/api/banner_principal/secundarios').success(function(data_banners){
            $scope.banners_secundarios = data_banners;
            console.dir($scope.banners_secundarios);
        }); 

        $http.get('/api/banner_principal/terciarios')
        .success(function(data_banners) {
            $scope.banners_terciarios = data_banners;
            console.dir($scope.banners_terciarios);
        });

        $http.get('/api/seccion/secciones_principales').success(function(secciones) {
        if (secciones && secciones.length !== 0) {
            //agrega secciones a scope
            $scope.secciones = secciones;
            //por cada seccion, busca productos asociados
            _.each($scope.secciones, function(sec) {
                //inicia array de productos por seccion
                sec.productos = [];
                $http.post('/api/producto/query_seccion', sec).success(function(productos_seccion) {
                    if (productos_seccion && productos_seccion.length !== 0) {
                        //agrega productos por seccion a scope
                        sec.productos = productos_seccion;
                        _.each(sec.productos, function(prod) {
                            var precio_format = formatCurrency.format(prod.precio);
                            //console.dir(precio_format);
                            prod.precio_format = precio_format;
                        });
                    } else {
                        //la seccion no tiene productos para mostrar
                    }
                }).error(function() {
                    //error get productos
                });
            });
            $scope.primera_seccion = _.first(secciones);
            console.dir($scope.primera_seccion);
            $scope.segunda_seccion = _.first(_.without(secciones, $scope.primera_seccion));
            console.dir($scope.segunda_seccion);
            $scope.tercera_seccion = _.first(_.without(secciones, $scope.segunda_seccion, $scope.primera_seccion));
            console.dir($scope.tercera_seccion);
        } else {
            //no existen secciones para mostrar
        }
    }).error(function() {
        //error get secciones
    });
        
    });   


