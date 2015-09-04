'use strict';
angular.module('pruebaAngularApp').controller('CheckoutCtrl', function($anchorScroll, $timeout, $stateParams, validarRut, formatCurrency, $state, $scope, Auth, $localStorage, $location, $window, $cookieStore, $http) {
    $anchorScroll('top');
    $scope.isAdmin = Auth.isAdmin;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.usr = {};
    $scope.user = {};
    var usuario = {}; 
    $scope.errors = {};
    $scope.user_r = {};
    $scope.errors_r = {};
    $scope.user_re = {};
    $scope.errors_re = {};
    $scope.carro_local = $localStorage; 
    $scope.tipo_usuario = 'enterprise';  
    $scope.accion = $stateParams.accion;
    $scope.errors = false;
    $scope.success = false;
    var msg_time = 3000;
    $scope.loading_login = false;
    $scope.loading_register = false;
    $scope.loading_register_e = false;
    $scope.newsletter = true;
    $scope.correo_novedades = '';
    $scope.loading = false; 
    //console.dir($scope.isLoggedIn());
    if ($cookieStore.get('token')) {
        $http.get('api/users/me').success(function(user) {
            $scope.usuario = user;
            $scope.tipo_usuario = $scope.usuario.role;
            console.dir($scope.usuario);            
        });
    }
    else{
        $scope.usuario = [];
    }

    $scope.regiones = ['I Tarapacá', 'II Antofagasta', 'III Atacama', 'IV Coquimbo', ' V Valparaiso', 'VI O Higgins', 'VII Maule', 
    'VIII Bío - Bío', 'IX Araucania', 'X Los Lagos', 'XI Aisén', 'XII Magallanes Y Antártica', 'XIII Metropolitana', 'XIV Los Ríos', 
    'XV Arica y Parinacota'];

    $scope.showComuna = function(){
        $scope.comunas = [];
        if($scope.usuario.region_despacho === 'I Tarapacá'){
            $scope.comunas = ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Camiña', 'Colchane', 
            'Huara', 'Pica'];
        }
        if($scope.usuario.region_despacho === 'II Antofagasta'){
            $scope.comunas = ['Antofagasta', 'Mejillones', 'Sierra Gorda', 'Taltal', 'Calama', 
            'Ollagüe','San Pedro de Atacama', 'Tocopilla', 'María Elena'];
        }
        if($scope.usuario.region_despacho === 'III Atacama'){
            $scope.comunas = ['Copiapó', 'Caldera', 'Tierra Amarilla', 'Chañaral', 'Diego de Almagro' , 
            'Vallenar', 'Alto del Carmen', 'Freirina', 'Huasco'];
        }
        if($scope.usuario.region_despacho === 'IV Coquimbo'){
            $scope.comunas = ['La Serena', 'Coquimbo', 'Andacollo', 'La Higuera', 'Paiguano', 'Vicuña' , 'Illapel', 
            'Canela', 'Los Vilos', 'Salamanca' , 'Ovalle', 'Combarbalá', 'Monte Patria', 'Punitaqui', 'Río Hurtado'];
        }
        if($scope.usuario.region_despacho === 'V Valparaiso'){
            $scope.comunas = ['Valparaíso', 'Casablanca', 'Concón', 'Juan Fernández', 'Puchuncaví', 'Quintero', 
            'Viña del Mar' , 'Isla de Pascua' , 'Los Andes', 'Calle Larga', 'Rinconada', 'San Esteban ', 'La Ligua',
            'Cabildo', 'Papudo', 'Petorca', 'Zapallar', 'Quillota', 'Calera', 'Hijuelas', 'La Cruz', 'Nogales',
            'San Antonio', 'Algarrobo', 'Cartagena', 'El Quisco', 'El Tabo', 'Santo Domingo', 'Felipe', 'Catemu',
            'Llaillay', 'Panquehue', 'Putaendo', 'Santa María', 'Limache', 'Quilpué', 'Villa Alemana', 'Olmué'];
        }
        if($scope.usuario.region_despacho === 'VI O Higgins'){
            $scope.comunas = ['Rancagua', 'Codegua', 'Coinco', 'Coltauco' ,'Doñihue','Graneros','Las Cabras','Machalí',
            'Malloa','Mostazal','Olivar','Peumo','Pichidegua','Quinta de Tilcoco','Rengo','Requínoa','San Vicente',
            'Pichilemu','La Estrella','Litueche','Marchihue','Navidad','Paredones','San Fernando','Chépica','Chimbarongo',
            'Lolol','Nancagua','Palmilla','Peralillo','Placilla','Pumanque','Santa Cruz'];
        }
        if($scope.usuario.region_despacho === 'VII Maule'){
            $scope.comunas = ['Talca','Constitución','Curepto','Empedrado','Maule','Pelarco','Pencahue',
            'Río Claro','San Clemente','San Rafael','Cauquenes','Chanco','Pelluhue','Curicó','Hualañé','Licantén',
            'Molina','Rauco','Romeral','Sagrada Familia','Teno','Vichuquén','Linares','Colbún','Longaví','Parral','Retiro',
            'San Javier','Villa Alegre','Yerbas Buenas'];
        }
        if($scope.usuario.region_despacho === 'VIII Bío - Bío'){
            $scope.comunas = ['Concepción','Coronel','Chiguayante','Florida','Hualqui','Lota','Penco','San Pedro de la Paz',
            'Santa Juana','Talcahuano','Tomé','Hualpén','Lebu','Arauco','Cañete','Contulmo','Curanilahue','Los Alamos',
            'Tirúa','Los Angeles','Antuco','Cabrero','Laja','Mulchén','Nacimiento','Negrete','Quilaco','Quilleco','San Rosendo',
            'Santa Bárbara','Tucapel','Yumbel','Alto Biobío','Chillán','Bulnes','Cobquecura','Coelemu','Coihueco','Chillán Viejo',
            'El Carmen','Ninhue','Ñiquén','Pemuco','Pinto','Portezuelo','Quillón','Quirihue','Ránquil','San Carlos','San Fabián',
            'San Ignacio','San Nicolás','Treguaco','Yungay'];
        }
        if($scope.usuario.region_despacho === 'IX Araucania'){
            $scope.comunas = ['Temuco','Carahue','Cunco','Curarrehue','Freire','Galvarino','Gorbea','Lautaro',
            'Loncoche','Melipeuco','Nueva Imperial','Padre Las Casas','Perquenco','Pitrufquén','Pucón','Saavedra','Teodoro Schmidt',
            'Toltén','Vilcún','Villarrica','Cholchol','Angol','Collipulli','Curacautín','Ercilla','Lonquimay',
            'Los Sauces','Lumaco','Purén','Renaico','Traiguén','Victoria'];
        }
        if($scope.usuario.region_despacho === 'X Los Lagos'){
            $scope.comunas = ['Puerto Montt','Calbuco','Cochamó','Fresia','Frutillar','Los Muermos','Llanquihue',
            'Maullín','Puerto Varas','Castro','Ancud','Chonchi','Curaco de Vélez','Dalcahue','Puqueldón','Queilén',
            'Quellón','Quemchi','Quinchao','Osorno','Puerto Octay','Purranque','Puyehue','Río Negro','San Juan de la Costa',
            'San Pablo'];
        }
        if($scope.usuario.region_despacho === 'XI Aisén'){
            $scope.comunas = ['Coihaique','Lago Verde','Aisén','Cisnes','Guaitecas','Cochrane','O Higgins',
            'Tortel','Chile Chico','Río Ibáñez'];
        }
        if($scope.usuario.region_despacho === 'XII Magallanes Y Antártica'){
            $scope.comunas = ['Punta Arenas','Laguna Blanca','Río Verde','San Gregorio','Cabo de Hornos (Ex-Navarino)','Antártica',
            'Porvenir','Primavera','Timaukel','Natales','Torres del Paine'];
        }
        if($scope.usuario.region_despacho === 'XIII Metropolitana'){
            $scope.comunas = ['Santiago','Cerrillos','Cerro Navia','Conchalí','El Bosque','Estación Central','Huechuraba',
            'Independencia','La Cisterna','La Florida','La Granja','La Pintana','La Reina','Las Condes','Lo Barnechea','Lo Espejo',
            'Lo Prado','Macul','Maipú','Ñuñoa','Pedro Aguirre Cerda','Peñalolén','Providencia','Pudahuel','Quilicura',
            'Quinta Normal','Recoleta','Renca','San Joaquín','San Miguel','San Ramón','Vitacura','Puente Alto','Pirque',
            'San José de Maipo','Colina','Lampa','Tiltil','San Bernardo','Buin','Calera de Tango','Paine','Melipilla','Alhué',
            'Curacaví','María Pinto','San Pedro','Talagante','El Monte','Isla de Maipo','Padre Hurtado','Peñaflor'];
        }
        if($scope.usuario.region_despacho === 'XIV Los Ríos'){
            $scope.comunas = ['Valdivia','Corral','Lanco','Los Lagos','Máfil','Mariquina','Paillaco','Panguipulli',
            'La Unión','Futrono','Lago Ranco','Río Bueno'];
        }
        if($scope.usuario.region_despacho === 'XV Arica y Parinacota'){
            $scope.comunas = ['Arica', 'Camarones', 'Putre', 'General Lagos'];
        }
    };
   $scope.login = function(form) {
        $scope.loading_login = true;
        if(form.$valid){
            Auth.login({
                email: $scope.user.email,
                password: $scope.user.password
            }).then(function() {
                // Logged in, redirect to checkout 
                if ($cookieStore.get('token')) {
                    $http.get('api/users/me').success(function(user) {
                        usuario = user;
                        $http.post('api/users/addcarro', {
                            user: usuario,
                            carrito: $localStorage
                        });
                    });
                }   
                $scope.loading_login = false;             
                $scope.mensaje_exito = 'Ha ingresado exitosamente. Redirigiendo ...';
                $scope.success = true;
                $window.location.reload();
                $timeout(function() {
                    $scope.success = false;
                }, msg_time);
            }).
            catch (function(err) {
                $scope.loading_login = false;
                console.dir(err);
                if (err && err.internal_code && (err.internal_code === 1 || err.internal_code === 2)){
                    $scope.mensaje_error = err.message;
                } 
                else {
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
        if(form.$valid){        
            if($scope.user_r.password_r === $scope.user_r.password_r2){
                Auth.createUser({
                    name: $scope.user_r.name_r,
                    email: $scope.user_r.email_r,
                    password: $scope.user_r.password_r,
                    role: 'user',
                    carrito: $scope.carro_local
                })
                .then(function() {
                    if ($cookieStore.get('token')) {
                        $http.get('api/users/me').success(function(user) {
                            $scope.usuario_o_empresa = user;                            
                        });
                    }   
                    $scope.loading_register = false;                 
                    $scope.mensaje_exito = 'Se ha registrado exitosamente. Redirigiendo ...';
                    $scope.success = true;
                    $window.location.reload();
                    $timeout(function() {
                        $scope.success = false;                        
                    }, msg_time);
                }).
                catch (function(err) {
                    $scope.loading_register = false;                    
                    console.log('login .. catch(error)');
                    $scope.mensaje_error = err.data.mensaje || 'Ha ocurrido un error.';
                    console.dir(err);
                    $scope.errors = true;
                    $timeout(function() {
                        $scope.errors = false;
                    }, msg_time); 
                });
            } 
            else{
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
        if(form.$valid){  
           if($scope.user_re.password_re === $scope.user_re.password_re2){
                Auth.createUser({
                    razon: $scope.user_re.name_re,
                    email: $scope.user_re.email_re,
                    password: $scope.user_re.password_re,
                    role: 'enterprise',
                    carrito: $scope.carro_local
                })
                .then(function() {
                    if ($cookieStore.get('token')) {
                        $http.get('api/users/me').success(function(user) {
                            $scope.usuario_o_empresa = user;                            
                        });
                    }
                    $scope.loading_register_e = false;
                    $scope.mensaje_exito = 'Se ha registrado exitosamente. Redirigiendo ...';
                    $scope.success = true;
                    $window.location.reload();
                    $timeout(function() {
                        $scope.success = false;                        
                    }, msg_time);
                }).
                catch (function(err) {
                    $scope.loading_register_e = false;
                    console.log('login .. catch(error)');
                    console.dir(arguments);
                    $scope.mensaje_error = err.data.mensaje || 'Ha ocurrido un error.';
                    $scope.errors = true;
                    $timeout(function() {
                        $scope.errors = false;
                    }, msg_time);   
                });
            } 
            else{
                $scope.loading_register_e = false;
                $scope.mensaje_error = 'Las contraseñas no coinciden';
                $scope.errors = true;
                 $timeout(function() {
                    $scope.errors = false;
                }, msg_time);    
            }
        }
    };
  
    $scope.confirmar = function(){
        var tipo_usuario = '';
        if($scope.usuario.name){
            tipo_usuario = 'persona';
        }
        else{
            tipo_usuario = 'empresa';
        }

        var confirmar_usuario = {   
            tipo_usuario: tipo_usuario,
            _id: $scope.usuario._id ? $scope.usuario._id : '',
            run: $scope.usuario.run ? $scope.usuario.run : '',
            name: $scope.usuario.name ? $scope.usuario.name : '',
            email: $scope.usuario.email ? $scope.usuario.email : '',
            telefono: $scope.usuario.telefono ? $scope.usuario.telefono : '',
            direccion: $scope.usuario.direccion ? $scope.usuario.direccion : '',
            tipo_entrega: $scope.usuario.tipo_entrega ? $scope.usuario.tipo_entrega : '',
            direccion_despacho: $scope.usuario.direccion_despacho ? $scope.usuario.direccion_despacho : '',
            region_despacho: $scope.usuario.region_despacho ? $scope.usuario.region_despacho : '',
            comuna_despacho: $scope.usuario.comuna_despacho ? $scope.usuario.comuna_despacho : '',
            rut: $scope.usuario.rut ? $scope.usuario.rut : '',
            giro: $scope.usuario.giro ? $scope.usuario.giro : '',
            razon: $scope.usuario.razon ? $scope.usuario.razon : '',
            accion: $scope.accion
        };
        var usuario_json = angular.toJson(confirmar_usuario);
        var encodedData = window.btoa(usuario_json);
        if(confirmar_usuario._id){
            $http.post('api/users/edituser', confirmar_usuario)
            .success(function() {                               
                $state.go('confirmar', {p: encodedData}); 
            });
        }
        else{            
            $state.go('confirmar', {p: encodedData}); 
        }      
    };

    $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
    };

    $http.get('/api/banner_principal/activos').success(function(data_banners) {
        $scope.banners_principales = data_banners;
    });
    $http.get('/api/banner_principal/secundarios').success(function(data_banners){
        $scope.banners_secundarios = data_banners;
        console.dir($scope.banners_secundarios);
    });
    $http.get('/api/banner_principal/terciarios')
    .success(function(data_banners) {
        $scope.banners_terciarios = data_banners;
        console.dir($scope.banners_terciarios);
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