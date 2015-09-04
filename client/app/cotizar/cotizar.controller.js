'use strict';

angular.module('pruebaAngularApp')
    .controller('CotizarCtrl', function ($anchorScroll, $scope, $http, $localStorage, carroService, $state, formatCurrency){
        //console.dir($localStorage);
        $anchorScroll('top'); 
        $scope.carro = $localStorage;  
        $scope.sobrestock = false; 
        console.dir($scope.carro.cotizacion_producto);        

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

        _.each($scope.carro.cotizacion_producto, function(producto){
            if(producto.cantidad > producto.stock){
                producto.sobrestock = true;                              
            }
            else{
                producto.sobrestock = false;              
            }
        }); 
        finalizar($localStorage.cotizacion_producto);
        
        $scope.removeCarro = function(producto){
          carroService.removeCotizacion(producto);
          finalizar($localStorage.cotizacion_producto);
        };  

        //verifica que cantidad comprada sea menor al stock del producto dependiendo la combinación de variantes
        $scope.cambiaCantidad = function(index, valor){
            var cantidad = $localStorage.cotizacion_producto[index].cantidad;         
            //console.dir(index);
            if(cantidad >= 1 && valor){             
                $localStorage.cotizacion_producto[index].cantidad = cantidad + 1;
                $localStorage.cotizacion_cantidad = $localStorage.cotizacion_cantidad + 1;
                
                if($localStorage.cotizacion_producto[index].cantidad > $localStorage.cotizacion_producto[index].stock){
                    $localStorage.cotizacion_producto[index].sobrestock = true;          
                }
                else{
                    $localStorage.cotizacion_producto[index].sobrestock = false;
                }                
            }
            if(cantidad > 1 && !valor){
                $localStorage.cotizacion_producto[index].cantidad = cantidad - 1;
                $localStorage.cotizacion_cantidad = $localStorage.cotizacion_cantidad - 1;

                if($localStorage.cotizacion_producto[index].cantidad > $localStorage.cotizacion_producto[index].stock){
                    $localStorage.cotizacion_producto[index].sobrestock = true;                                     
                } 
                else{
                    $localStorage.cotizacion_producto[index].sobrestock = false;  
                }
            } 
            finalizar($localStorage.cotizacion_producto);                                 
        };

        $scope.goToCheckout = function(){
            $state.go('checkout', {accion: 'cotizar'});
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


