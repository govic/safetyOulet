'use strict';
angular.module('pruebaAngularApp').controller('MainCtrl', function($anchorScroll, $scope, $http, $timeout, formatCurrency) {
    console.log('Inicia .. MainCtrl');
    //indica las secciones que se mostraran en la pagina principal
    $anchorScroll('top');
    $scope.secciones = [];
    $scope.newsletter = true;
    $scope.correo_novedades = '';
    $scope.loading = false; 
    //indica los benners principales que se mostraran en la pagina principal
    $scope.banners_principales = [];    
    $scope.banners_secundarios = [];
    $scope.categorias_pag_principal = [];
    $scope.categorias = [];
    //obtiene secciones que se mostraran en pagina pincipal
    //IMPORTANTE: La carca de secciones y productos es asincrona .. el objeto se carga a la par con la vista
    console.log('MainCtrl .. $http.get(/api/seccion/secciones_principales)');
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
    $http.get('api/filtros/pag_principal').success(function(filtros) {
        $scope.categorias_pag_principal = filtros;
    });
    //obtiene imagenes banner principal
    console.log('MainCtrl .. $http.get(/api/banner_principal/activos)');
    $http.get('/api/banner_principal/activos').success(function(data_banners) {
        $scope.banners_principales = data_banners;
    });
    $http.get('/api/banner_principal/secundarios').success(function(data_banners){
        $scope.banners_secundarios = data_banners;
        console.dir($scope.banners_secundarios);
    });
    $scope.mensaje_newsletter = '';
    $scope.subscribe = function(correo_novedades) {
        $scope.loading = true; 
        var msg_hide_time = 5000;
        if (correo_novedades && correo_novedades.trim() !== '') {
            correo_novedades = correo_novedades.trim();
            $http.get('api/tiendas').success(function(tiendas) { //busca tienda
                if (tiendas && tiendas.length > 0 && tiendas[0] && tiendas[0]._id) {
                    var correo_string = JSON.stringify({ //datos de entrada
                        correo: correo_novedades,
                        tienda: tiendas[0]._id
                    });
                    $http.post('api/servicios/encriptar/checkout', correo_string).success(function(correo_encrypt) {
                        $http.post(tiendas[0].url_checkout + 'ServicioTienda/SuscribirCorreo', JSON.stringify({ //TODO dejar esta linea en test y prod
                        //$http.post('http://localhost:49191/ServicioTienda/SuscribirCorreo', JSON.stringify({ //esta linea es solo para desa
                            c: correo_encrypt
                        })).success(function(res) {
                            if (res.status && res.status === 'JSON_CODE_STATUS_OK') { //respuesta exitosa
                                $scope.mensaje_newsletter = 'Te has suscrito a nuestro newsletter';
                                $scope.exito = true;
                                $timeout(function() {
                                    $scope.exito = false;
                                    $scope.correo_novedades = '';
                                }, msg_hide_time);
                            } else if(res.status && res.status === 'JSON_CODE_STATUS_ERROR') {//error conocixo
                                console.log('Error conocido al suscribir newsletter');
                                console.dir(res);
                                $scope.mensaje_newsletter = res.mensaje;
                                $scope.error = true;
                                $timeout(function() {
                                    $scope.error = false;
                                    $scope.correo_novedades = '';
                                }, msg_hide_time);
                            } else { //error no controlado
                                console.log('Error no controlado al llamar a api SuscribirCorreo');                                
                                $scope.mensaje_newsletter = 'En estos momentos no es posible realizar la suscripción, por favor intente más adelante.';
                                $scope.error = true;
                                $timeout(function() {
                                    $scope.error = false;
                                    $scope.correo_novedades = '';
                                }, msg_hide_time);
                            }
                            $scope.loading = false; 
                        }).error(function(err) {
                            console.log('Error al llamar a api SuscribirCorreo');
                            console.dir(err);
                            $scope.mensaje_newsletter = 'En estos momentos no es posible realizar la suscripción, por favor intente más adelante.';
                            $scope.error = true;
                            $timeout(function() {
                                $scope.error = false;
                                $scope.correo_novedades = '';
                            }, msg_hide_time);
                            $scope.loading = false; 
                        });
                    }).error(function(err) {
                        console.log('Error al encriptar entrada newsletter');
                        console.dir(err);
                        $scope.mensaje_newsletter = 'En estos momentos no es posible realizar la suscripción, por favor intente más adelante.';
                        $scope.error = true;
                        $timeout(function() {
                            $scope.error = false;
                            $scope.correo_novedades = '';
                        }, msg_hide_time);
                        $scope.loading = false; 
                    });
                }
            });
        } else {
            $scope.mensaje_newsletter = 'El correo electrónico es obligatorio para realizar la suscripción.';
            $scope.error = true;
            $timeout(function() {
                $scope.error = false;
                $scope.correo_novedades = '';
            }, msg_hide_time);
            $scope.loading = false;
        }
        $scope.correo_novedades = '';
    };
});
