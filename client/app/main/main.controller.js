'use strict';
angular.module('pruebaAngularApp').controller('MainCtrl', function ($state, $anchorScroll, $scope, $http, $timeout, formatCurrency) {
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
    $scope.categorias_texto = 'Categorías';
     //variables para busqueda filtrada
    $scope.filtros_padre = [];
    $scope.filtro_escogido = {};
    $scope.palabras_clave = '';

    //para mover la busqueda
    var buscador_flotante = angular.element(document.getElementById('buscador-flotante-id'));
    var buscador = angular.element(document.getElementById('buscador-id'));
    var buscador_colapse = angular.element(document.getElementById('buscador-colapse-id'));
    var win = angular.element(window);

    angular.element(window).scroll(function(){
        //console.dir(win.scrollTop());
        //console.dir(bbuscador.offset().top + buscador.outerHeight(true));

        if(win.scrollTop() < buscador.offset().top + buscador.outerHeight(true)){ 
            buscador_flotante.removeClass('show-buscador'); 
            buscador_colapse.removeClass('hide');     
        }
        else{
            buscador_flotante.addClass('show-buscador'); 
            buscador_colapse.addClass('hide');
        }
        
    });
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

    $http.get('api/filtros/padres')
    .success(function(filtros){
        $scope.filtros_padre = filtros;
        console.dir($scope.filtros_padre);
    });

    $scope.setFilter = function(filter){
        $scope.selectCollapse = true;
        $scope.categorias_texto = filter.glosa_filtro;
        $scope.filtro_escogido = filter;
        $scope.busquedaFiltros();
    };

    $scope.setFilter2 = function(filter){
        $scope.selectCollapse2 = true;
        $scope.categorias_texto = filter.glosa_filtro;
        $scope.filtro_escogido = filter;
        $scope.busquedaFiltros();
    };

    $scope.busquedaFiltros = function(){
        var palabras = $scope.palabras_clave.split(' ');
        var busqueda = {filtro_id: $scope.filtro_escogido._id, palabras: palabras};
        console.dir(busqueda);
        var busqueda_json = angular.toJson(busqueda);
        var encodedData = window.btoa(busqueda_json);
        $state.go('busqueda_filtros', {busqueda: encodedData});
    };
});
