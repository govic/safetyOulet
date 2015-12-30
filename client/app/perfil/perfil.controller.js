'use strict';
angular.module('pruebaAngularApp').controller('PerfilCtrl', function($anchorScroll, $state, validarRut, $cookieStore, $http, $scope, $stateParams, CONSTANTES) {
    $anchorScroll('top');
    $scope.EMAIL_REGEXP = CONSTANTES.EMAIL_REGEXP;
    $scope.TEL_REGEXP = CONSTANTES.TEL_REGEXP;
    $scope.mostrar_detalle = false;
    $scope.mostrar_detalle_c = false;
    $scope.editar_perfil = false;
    $scope.mensajes_error = [];
    $scope.mensajes_error2 = [];
    var usuario = {};

    $scope._id = $stateParams.user_id;
    console.dir($scope._id);
    var decodedData = window.atob($stateParams.user_id);
    var user_id = angular.fromJson(decodedData);
    console.dir(user_id);

    if ($cookieStore.get('token')) {
        $http.get('/api/users/me').success(function(user) {
            if (user_id === user._id) {
                $scope.usuario = user;
                $scope.correo_original = user.email;
                $http.post('api/compras/findcompras', {
                    id_usuario: user_id
                }).success(function(compras) {
                    $scope.compras = compras;
                    console.dir($scope.compras);
                });

                $http.post('api/cotizacion/findcotizacion', {
                    id_usuario: user_id
                }).success(function(cotizacion) {
                    $scope.cotizaciones = cotizacion;
                    console.dir($scope.cotizaciones);
                });
            } else {
                $state.go('main');
            }
        });
    } else {
        $state.go('main');
    }

    $scope.editProfile = function() {
        $scope.editar_perfil = true;
    };
    $scope.saveProfile = function() {
        if ($scope.usuario.role === 'user') {
            $scope.mensajes_error = [];
            console.dir(validarRut.validar($scope.usuario.run));
            if (validarRut.validar($scope.usuario.run) === false) {
                $scope.mensajes_error.push(false);
                $scope.usuario.run = '';
            } else {
                $scope.mensajes_error.push(true);
                usuario = {
                    _id: user_id,
                    name: $scope.usuario.name,
                    email: $scope.usuario.email,
                    run: $scope.usuario.run,
                    telefono: $scope.usuario.telefono,
                    direccion: $scope.usuario.direccion
                };
                $http.post('api/users/edituser', usuario).success(function() {
                    $scope.editar_perfil = false;
                }).error(function(err) {
                    console.error('error al modifica datos perfil');
                    console.error(err);
                    if (err && err.error_correo_ocupado) {
                        $scope.usuario.email = $scope.correo_original;
                        window.alert('El correo ingresado ya esta en uso, por favor ingrese otro correo.');
                    } else {
                        window.alert('En estos momentos no podemos atender a su solicitud, por favor inténtelo más tarde.');
                    }
                });
            }
        } else if ($scope.usuario.role === 'enterprise') {
            $scope.mensajes_error2 = [];
            if (validarRut.validar($scope.usuario.rut) === false) {
                $scope.mensajes_error2.push(false);
            } else {
                $scope.mensajes_error2.push(true);
                usuario = {
                    _id: user_id,
                    razon: $scope.usuario.razon,
                    giro: $scope.usuario.giro,
                    email: $scope.usuario.email,
                    rut: $scope.usuario.rut,
                    telefono: $scope.usuario.telefono,
                    direccion: $scope.usuario.direccion
                };
                $http.post('api/users/edituser', usuario).success(function() {
                    $scope.editar_perfil = false;
                }).error(function(err) {
                    console.error('error al modifica datos perfil');
                    console.error(err);
                    if (err && err.error_correo_ocupado) {
                        $scope.usuario.email = $scope.correo_original;
                        window.alert('El correo ingresado ya esta en uso, por favor ingrese otro correo.');
                    } else {
                        window.alert('En estos momentos no podemos atender a su solicitud, por favor inténtelo más tarde.');
                    }
                });
            }
        }
    };
    $scope.viewDetails = function(compra) {
        $scope.mostrar_detalle = true;
        console.dir(compra);
        $scope.compra = compra;
        $scope.compra.details = true;
        $scope.detalle_compra = compra.compra;
        _.each($scope.compras, function(comp) {
            if (comp._id !== compra._id) {
                comp.details = false;
            }
        });
    };
    $scope.hideDetails = function(compra) {
        $scope.mostrar_detalle = false;
        $scope.compra = compra;
        $scope.compra.details = false;
    };

    $scope.viewDetailsCotizacion = function(cotizacion) {
        $scope.mostrar_detalle_c = true;
        console.dir(cotizacion);
        $scope.cotizacion = cotizacion;
        $scope.cotizacion.details = true;
        $scope.detalle_cotizacion = cotizacion.cotizacion;
        _.each($scope.cotizaciones, function(cot) {
            if (cot._id !== cotizacion._id) {
                cot.details = false;
            }
        });
    };
    $scope.hideDetailsCotizacion = function(cotizacion) {
        $scope.mostrar_detalle_c = false;
        $scope.cotizacion = cotizacion;
        $scope.cotizacion.details = false;
    };
});
