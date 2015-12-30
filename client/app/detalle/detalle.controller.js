'use strict';
angular.module('pruebaAngularApp').controller('DetalleCtrl', function($anchorScroll, $state, $scope, $http, $stateParams, carroService, $cookieStore, $location, $timeout, formatCurrency, CONSTANTES) {
    $anchorScroll('top');
    $scope.EMAIL_REGEXP = CONSTANTES.EMAIL_REGEXP;
    $scope.exito = false;
    $scope.exito5 = false;
    $scope.detalle = [];
    $scope.cantidad = [];
    $scope.ruta = [];
    $scope.productos_relacionados = [];
    $scope.variantes_producto = [];
    $scope.foto_principal = [];
    $scope.opciones_carro = [];
    $scope.small = '';
    $scope.large = '';
    $scope.precio_formato = '';
    $scope.precios = [];
    $scope.stocks_informar = [];
    var marca = {};
    var id_usuario = '';
    $scope.correo = '';

    $scope.correo_stock_loading = false;
    $scope.tellMeWhen = function(stocks_informar) {
        $scope.correo_stock_loading = true;
        var stocks_falsos = true;
        var hide_time = 5000;
        _.each(stocks_informar, function(stock) {
            if (stock === true) {
                stocks_falsos = false;
            }
        });
        console.dir(stocks_falsos);
        if (stocks_informar.length === 0 || stocks_falsos || $scope.correo === '' || $scope.correo === undefined) {
            $scope.correo_stock_loading = false;
            $scope.mensaje = 'Debe marcar por lo menos una opción de producto.';
            $scope.error = true;
            $timeout(function() {
                $scope.exito2 = false;
                $scope.error = false;
            }, hide_time);
        } else {
            $scope.productos_informar = [];
            $scope.informe = {
                id_usuario: id_usuario,
                correo: '',
                id_producto: 0,
                stocks: []
            };
            for (var j = 0; j < $scope.detalle.stock.length; j++) {
                if (stocks_informar[j] === true) {
                    $scope.productos_informar.push($scope.detalle.stock[j]);
                }
            }
            $scope.informe.correo = $scope.correo;
            $scope.informe.id_producto = $scope.detalle._id;
            $scope.informe.stocks = $scope.productos_informar;
            //console.dir($scope.informe);
            $http.get('api/tiendas').success(function(tiendas) {
                if (tiendas && tiendas.length > 0 && tiendas[0] && tiendas[0]._id) {
                    var informe_string = JSON.stringify($scope.informe);
                    $http.post('api/servicios/encriptar/checkout', informe_string).success(function(informe_encrypt) {
                        //$http.post('http://localhost:49191/ServicioTienda/SuscribirProductos', JSON.stringify({
                        $http.post(tiendas[0].url_checkout + 'ServicioTienda/SuscribirProductos', JSON.stringify({
                            p: informe_encrypt
                        })).success(function() {
                            $scope.correo_stock_loading = false;
                            $scope.mensaje = 'Solicitud exitosa. Pronto le avisaremos el nuevo stock del producto';
                            $scope.exito2 = true;
                            $timeout(function() {
                                $scope.exito2 = false;
                                $scope.exito2 = false;
                            }, hide_time);
                        }).error(function(err) {
                            console.log('Error al suscribir productos');
                            console.dir(err);
                            $scope.correo_stock_loading = false;
                            $scope.mensaje = 'En estos momentos no es posible registrar el aviso de stock, por favor intente más tarde.';
                            $scope.error = true;
                            $timeout(function() {
                                $scope.exito2 = false;
                                $scope.exito2 = false;
                            }, hide_time);
                        });
                    }).error(function(err) {
                        console.log('Error al encriptar entrada suscribir productos');
                        console.dir(err);
                        $scope.correo_stock_loading = false;
                        $scope.mensaje = 'En estos momentos no es posible registrar el aviso de stock, por favor intente más tarde.';
                        $scope.error = true;
                        $timeout(function() {
                            $scope.exito2 = false;
                            $scope.exito2 = false;
                        }, hide_time);
                    });
                }
            });
        }
    };
    $scope.addCarro = function(producto, cantidad) {
        console.dir(producto);
        console.dir(cantidad);
        if (cantidad.length !== 0) {
            $scope.precios = [];
            $scope.elegidos = [];
            $scope.variantes = [];
            _.each(producto.stock, function(stock) {
                var opcion = _.find(producto.variantes[0].valores, function(opcion) {
                    return opcion._id === stock.combinacion[0]._id_opcion;
                });
                $scope.variantes.push(opcion);
                var precio_recalculado = $scope.recalcularPrecio(producto, opcion);
                $scope.precios.push(precio_recalculado);
                $scope.elegidos.push({
                    codigo_sku: stock.codigo,
                    stock: stock.stock,
                    peso: stock.peso
                });
            });
            console.dir(producto);
            console.dir(cantidad);
            console.dir($scope.variantes);
            console.dir($scope.precios);
            console.dir($scope.elegidos);
            for (var i = 0; i < cantidad.length; i++) {
                carroService.add(producto, cantidad[i], [$scope.variantes[i]], $scope.precios[i], $scope.elegidos[i]);
            }
            $scope.exito = true;
            $timeout(function() {
                $scope.exito = false;
            }, 2500);
            $scope.cantidad = [];
        }
    };

    $scope.recalcularPrecio = function(producto, opcion_variante) {
        //console.dir(opcion_variante);
        var precio_aux = _.clone(producto.precio);
        if (opcion_variante && producto) {
            if (opcion_variante.tipo_operacion === 'Descuento') {
                if (opcion_variante.operacion === 'Porcentaje') {
                    precio_aux = precio_aux - precio_aux * (parseInt(opcion_variante.costo) / 100);
                } else if (opcion_variante.operacion === 'SumaResta') {
                    precio_aux = precio_aux - parseInt(opcion_variante.costo);
                }
            }
            if (opcion_variante.tipo_operacion === 'Recargo') {
                if (opcion_variante.operacion === 'Porcentaje') {
                    precio_aux = precio_aux + precio_aux * (parseInt(opcion_variante.costo) / 100);
                } else if (opcion_variante.operacion === 'SumaResta') {
                    precio_aux = precio_aux + parseInt(opcion_variante.costo);
                }
            }
            return precio_aux;
        }
    };
    $scope.cotizarEmpresa = function(producto, cantidad) {
        //console.dir(cantidad);
        if (cantidad.length !== 0) {
            $scope.elegidos = [];
            $scope.variantes = [];
            _.each(producto.stock, function(stock) {
                var opcion = _.find(producto.variantes[0].valores, function(opcion) {
                    return opcion._id === stock.combinacion[0]._id_opcion;
                });
                $scope.variantes.push(opcion);
                $scope.elegidos.push({
                    codigo_sku: stock.codigo,
                    stock: stock.stock,
                    peso: stock.peso
                });
            });
            console.dir(producto);
            console.dir(cantidad);
            console.dir($scope.variantes);
            console.dir($scope.elegidos);
            for (var i = 0; i < cantidad.length; i++) {
                carroService.cotizar(producto, cantidad[i], [$scope.variantes[i]], $scope.elegidos[i]);
            }
            $scope.exito5 = true;
            $timeout(function() {
                $scope.exito5 = false;
            }, 2500);
            $scope.cantidad = [];
        }
    };
    $scope.goToCart = function() {
        $state.go('carro');
    };

    //obtiene detalles del producto
    $http.get('api/producto/' + $stateParams.id_producto).success(function(detalle_producto) {

        $scope.detalle = detalle_producto;

        //tracking si usuario esta logueado
        //el metodo fue movido desde la parte inicial del controlador hasta aqui para no hacer dos veces la consulta del producto
        if ($cookieStore.get('token')) {
            $http.get('/api/users/me').success(function(user) {
                //las siguientes dos variables estaban en una consulta user/me aparte, fueron movidas aqui adentro para no hacer dos veces la consulta de datos usuario
                $scope.correo = user.email;
                id_usuario = user._id;
                $http.post('api/trackings', {
                    usuario_id: user._id,
                    usuario_nombre: user.role === 'enterprise' ? user.razon : user.name,
                    usuario_correo: user.email,
                    usuario_tipo: user.role === 'enterprise' ? 'empresa' : 'persona',
                    tipo_elemento: 'producto',
                    id_elemento: parseInt(detalle_producto._id),
                    elemento: detalle_producto.nombre,
                    fecha: new Date()
                });
            });
        }


        //guarda un copia de los filtros del producto           
        var filtros = _.clone($scope.detalle.filtros);

        //capturar marca
        marca = _.find(filtros, function(filtro) {
            return filtro.tipo === 'MARCA';
        });
        $scope.precio = _.clone($scope.detalle.precio);

        //formatea el precio con punto separador de miles
        $scope.precio_formato = _.clone($scope.precio);
        $scope.precio_formato = formatCurrency.format($scope.precio_formato);
        $scope.foto_principal = $scope.detalle.images[0];
        angular.element(document.getElementById('desc_larga')).append($scope.detalle.descripcion_larga);

        //obtiene todas los filtros para obtener detalle filtro MARCA
        //este metodo podria ser reemplazado por un get/show by id filtro
        if (marca) {
            $http.get('/api/filtros').success(function(filtros2) {
                $scope.marca = _.find(filtros2, function(filtro) {
                    return filtro._id === marca._id;
                });
            });
        }

        //deja solo lso filtro categoría y subcategoria
        for (var i = 0; i <= filtros.length - 1; i++) {
            if (filtros[i].es_menu_filtro === false && filtros[i].es_activo_filtro === false) {
                filtros.splice(i, 1);
            }
        }

        //quita los filtros categoria root
        for (var j = 0; j <= filtros.length - 1; j++) {
            if (filtros[j].dependencias_filtro[0] === null) {
                filtros.splice(j, 1);
            }
        }

        //obtiene detalle del primer filtro asociado al producto
        if ($scope.detalle.filtros && $scope.detalle.filtros.length > 0) {
            $http.get('api/filtros/' + $scope.detalle.filtros[0]._id).success(function(data) {
                var parte_ruta = data;
                var ultimo = data;
                if (parte_ruta.dependencias_filtro[0] !== null) {
                    while (parte_ruta.dependencias_filtro[0] !== null) {
                        $scope.ruta.push(parte_ruta.dependencias_filtro[0]);
                        parte_ruta = parte_ruta.dependencias_filtro[0];
                    }
                }
                $scope.ruta.push(ultimo);
                $scope.ultimo = ultimo;
            });
        }
    });

    //obtiene producto relacionados
    $http.get('/api/producto/' + $stateParams.id_producto + '/relacionados').success(function(data) {
        $scope.productos_relacionados = data;
    });

    //metodo para cambiar entre fotos del producto
    $scope.changePicture = function(item) {
        $scope.foto_principal = item;
        $scope.small = 'assets/producto/medium_' + $scope.foto_principal.toString();
        $scope.large = 'assets/producto/' + $scope.foto_principal.toString();
        $scope.data = {
            small_image: $scope.small,
            large_image: $scope.large
        };
        $scope.exito = false;
    };

    //obtiene secciones principales
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
                    }
                }).error(function(err) {
                    console.error('error al obtener producto dentro de seccion');
                    console.error(err);
                });
            });
            $scope.primera_seccion = _.first(secciones);
            $scope.segunda_seccion = _.first(_.without(secciones, $scope.primera_seccion));
            $scope.tercera_seccion = _.first(_.without(secciones, $scope.segunda_seccion, $scope.primera_seccion));
            console.dir($scope.primera_seccion);
            console.dir($scope.segunda_seccion);
            console.dir($scope.tercera_seccion);
        }
    }).error(function(err) {
        console.error('error al obtener secciones principales');
        console.error(err);
    });

    //obtiene banners secciones secundarias //no existen secciones terciarias
    $http.get('/api/banner_principal/secundarios').success(function(data_banners) {
        $scope.banners_secundarios = data_banners;
    });
});
