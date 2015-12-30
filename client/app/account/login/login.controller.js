'use strict';
angular.module('pruebaAngularApp').controller('LoginCtrl', function($anchorScroll, $timeout, $state, $scope, Auth, $location, $window, $cookieStore, $http, $localStorage, CONSTANTES) {
    $anchorScroll('top');
    $scope.EMAIL_REGEXP = CONSTANTES.EMAIL_REGEXP;
    $scope.TEL_REGEXP = CONSTANTES.TEL_REGEXP;
    $scope.isAdmin = Auth.isAdmin;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.user = {};
    var sql_user = {};
    $scope.errors = {};
    $scope.user_r = {};
    $scope.user_re = {};
    $scope.carro_local = $localStorage;
    $scope.mensaje_error = '';
    $scope.mensaje_exito = '';
    var usuario = {};
    $scope.errors = false;
    $scope.success = false;
    $scope.loading_login = false;
    $scope.loading_register = false;
    $scope.loading_register_e = false;
    var msg_time = 3000;

    if ($cookieStore.get('token')) {
        $http.get('/api/users/me').success(function() {
            $state.go('perfil');
        });
    }

    $scope.login = function(form) {
        $scope.loading_login = true;
        if (form.$valid) {
            Auth.login({
                email: $scope.user.email,
                password: $scope.user.password
            }).then(function() {
                // Logged in, redirect to checkout 
                if ($cookieStore.get('token')) {
                    $http.get('/api/users/me').success(function(user) {
                        usuario = user;
                        $http.post('api/users/addcarro', {
                            user: usuario,
                            carrito: $localStorage
                        });
                    });
                }
                $scope.loading_login = false;
                $scope.mensaje_exito = 'Ha ingresado exitosamente';
                $scope.success = true;
                $timeout(function() {
                    $scope.success = false;
                    $state.go('main');
                }, msg_time);
            }).catch(function(err) {
                console.error(err);
                $scope.loading_login = false;
                if (err && err.internal_code && (err.internal_code === 1 || err.internal_code === 2)) {
                    $scope.mensaje_error = err.message;
                } else {
                    $scope.mensaje_error = 'En estos momentos presentamos dificultades técnicas, por favor intente ingresar en unos minutos.';
                }
                $scope.errors = true;
                $timeout(function() {
                    $scope.errors = false;
                }, msg_time);
            });
        }
    };

    $scope.register = function(form) {
        $scope.loading_register = true;
        if (form.$valid) {
            if ($scope.user_r.password_r === $scope.user_r.password_r2) {
                Auth.createUser({
                    name: $scope.user_r.name_r,
                    email: $scope.user_r.email_r,
                    password: $scope.user_r.password_r,
                    role: 'user',
                    carrito: $scope.carro_local
                }).then(function() {
                    if ($cookieStore.get('token')) {
                        $http.get('/api/users/me').success(function(user) {
                            $scope.usuario_o_empresa = user;
                            sql_user = user;
                            console.dir(sql_user);
                        });
                    }
                    $scope.loading_register = false;
                    $scope.mensaje_exito = 'Se ha registrado exitosamente';
                    $scope.success = true;
                    $timeout(function() {
                        $scope.success = false;
                        $state.go('main');
                    }, msg_time);
                }).catch(function(err) {
                    console.error('error en registro usuario');
                    console.error(err);
                    $scope.mensaje_error = err.data.errors.email.message || 'Ha ocurrido con el registro de usuario, por favor intente más tarde';
                    $scope.loading_register = false;
                    $scope.errors = true;
                    $timeout(function() {
                        $scope.errors = false;
                    }, msg_time);
                });
            } else {
                $scope.loading_register = false;
                $scope.mensaje_error = 'Las contraseñas no coinciden';
                $scope.errors = true;
                $timeout(function() {
                    $scope.errors = false;
                }, msg_time);
            }
        }
    };

    $scope.register_e = function(form) {
        $scope.loading_register_e = true;
        if (form.$valid) {
            if ($scope.user_re.password_re === $scope.user_re.password_re2) {
                Auth.createUser({
                        razon: $scope.user_re.name_re,
                        email: $scope.user_re.email_re,
                        password: $scope.user_re.password_re,
                        role: 'enterprise',
                        carrito: $scope.carro_local
                    })
                    .then(function() {
                        if ($cookieStore.get('token')) {
                            $http.get('/api/users/me').success(function(user) {
                                $scope.usuario_o_empresa = user;
                                sql_user = user;
                            });
                        }
                        $scope.loading_register_e = false;
                        $scope.mensaje_exito = 'Se ha registrado exitosamente';
                        $scope.success = true;
                        $timeout(function() {
                            $scope.success = false;
                            $state.go('main');
                        }, msg_time);
                    }).
                catch(function(err) {
                    console.error('error en registro usuario');
                    console.error(err);
                    $scope.mensaje_error = err.data.errors.email.message || 'Ha ocurrido con el registro de usuario, por favor intente más tarde';
                    $scope.loading_register_e = false;
                    $scope.errors = true;
                    $timeout(function() {
                        $scope.errors = false;
                    }, msg_time);
                });
            } else {
                $scope.loading_register_e = false;
                $scope.mensaje_error = 'Las contraseñas no coinciden';
                $scope.errors = true;
                $timeout(function() {
                    $scope.errors = false;
                }, msg_time);
            }
        }
    };


    $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
    };
});
