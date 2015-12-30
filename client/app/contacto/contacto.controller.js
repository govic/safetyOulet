'use strict';

angular.module('pruebaAngularApp').controller('ContactoCtrl', function($anchorScroll, $scope, $http, $timeout, formatCurrency, CONSTANTES) {
    $anchorScroll('top');
    $scope.EMAIL_REGEXP = CONSTANTES.EMAIL_REGEXP;
    $scope.TEL_REGEXP = CONSTANTES.TEL_REGEXP;
    $scope.contacto = {};
    $scope.loading = false;
    $scope.contact = function() {
        $scope.loading = true;
        console.dir($scope.contacto);
        $http.get('api/tiendas').success(function(tiendas) {
            if (tiendas && tiendas.length > 0 && tiendas[0] && tiendas[0]._id) {
                $scope.contacto.tienda = tiendas[0]._id;
                var contacto_string = JSON.stringify($scope.contacto);
                $http.post('api/servicios/encriptar/checkout', contacto_string).success(function(contacto_encrypt) {
                    $http.post(tiendas[0].url_checkout + 'ServicioTienda/Contacto', JSON.stringify({
                        c: contacto_encrypt
                    })).success(function() {
                        $scope.loading = false;
                        $scope.mensaje = 'Solicitud exitosa. Pronto nos comunicaremos con Usted.';
                        $scope.exito = true;
                        $timeout(function() {
                            $scope.exito = false;
                            $scope.contacto = [];
                        }, 3000);
                    }).error(function(err) {
                        $scope.loading = false;
                        $scope.mensaje = err;
                        $scope.error = true;
                        $timeout(function() {
                            $scope.exito = false;
                        }, 3000);
                    });
                });
            }
        });
    };

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
        }
    }).error(function(err) {
        console.error('error al obtener secciones principales');
        console.error(err);
    });

    $http.get('/api/banner_principal/secundarios').success(function(data_banners) {
        $scope.banners_secundarios = data_banners;
        console.dir($scope.banners_secundarios);
    }).error(function(err) {
        console.error('error al obtener secciones secundarias');
        console.error(err);
    });

    $http.get('/api/banner_principal/terciarios').success(function(data_banners) {
        $scope.banners_terciarios = data_banners;
        console.dir($scope.banners_terciarios);
    }).error(function(err) {
        console.error('error al obtener secciones terciarias');
        console.error(err);
    });
});
