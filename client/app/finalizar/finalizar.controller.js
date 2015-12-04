/*

23-11-2015 Hector Fuentes
copia codigo desde HW para funcionalidad proceso compra recortado

*/

'use strict';

angular.module('pruebaAngularApp').controller('FinalizarCtrl', function($scope, $cookieStore, $http, validarRut, $localStorage, $state, formatCurrency, constantes, $window, carroService, Auth, $timeout) {
	//validacion carro de compras
	if (!carroService.validaCarroCompra()) {
		console.log('error al validar carro de compras en localstorage');
		$state.go('carro');
	}

	//modelo de datos de la vista
	$scope.usuario = {
		mensaje: {
			mostrar: false,
			texto: '',
			tipo: '',
			crear_mensaje: function(texto, tipo, reset) {
				$scope.usuario.mensaje.mostrar = true;
				$scope.usuario.mensaje.texto = texto;
				$scope.usuario.mensaje.tipo = tipo;
				if (reset) {
					$scope.usuario.mensaje.reset_mensaje();
				}
			},
			reset_mensaje: function() {
				$timeout(function() {
					$scope.usuario.mensaje.mostrar = false;
					$scope.usuario.mensaje.texto = '';
					$scope.usuario.mensaje.tipo = '';
				}, 4000);
			}
		},
		login: {
			estaLogueado: false,
			correo: '',
			password: ''
		},
		datos: {
			id: '',
			rut: '',
			nombre: '',
			giro: '',
			correo: '',
			telefono: '',
			direccion: '',
			direccion_despacho: '',
			region_despacho: '',
			comuna_despacho: '',
			tipo_envio: 'despacho_domicilio',
			tienda_retiro: 'tienda_1',
			medio_pago: 'webpay',
			esDespacho: function() {
				return $scope.usuario.datos.tipo_envio === 'despacho_domicilio';
			},
			esPersona: true,
			//metodo para importar datos desde post hacia modelo vista
			importDatos: function(data, estaLogueado) {
				//datos
				$scope.usuario.datos.id = data._id;
				$scope.usuario.datos.esPersona = data.role === 'user';
				$scope.usuario.datos.rut = data.role === 'user' ? data.run : data.rut;
				$scope.usuario.datos.nombre = data.role === 'user' ? data.name : data.razon;
				$scope.usuario.datos.giro = data.giro;
				$scope.usuario.datos.correo = data.email;
				$scope.usuario.datos.telefono = data.telefono;
				$scope.usuario.datos.direccion = data.direccion;
				//login
				$scope.usuario.login.estaLogueado = estaLogueado;
				$scope.usuario.login.correo = data.email;
				//validacion
				$scope.usuario.datos.validar();
			},
			//indica si todos los campos son validos
			validar: function() {
				/* validacion datos de usuario */

				//validacion de rut se hace en metodo $scope.formatoValidaRut
				if ($scope.usuario.datos.rut) {
					$scope.usuario.datos.rut = validarRut.formatoGuion($scope.usuario.datos.rut); //formatea
					$scope.usuario.errores.rut = !validarRut.validar($scope.usuario.datos.rut); //valida
				} else {
					$scope.usuario.errores.rut = true;
				}
				//valida nombre
				$scope.usuario.errores.nombre = $scope.usuario.datos.nombre ? false : true;
				//valida giro
				$scope.usuario.errores.giro = $scope.usuario.datos.esPersona ? false : ($scope.usuario.datos.giro ? false : true);
				//valida correo
				$scope.usuario.errores.correo = $scope.usuario.datos.correo ? false : true;
				//valida telefono
				$scope.usuario.errores.telefono = $scope.usuario.datos.telefono ? false : true;
				//valida direccion
				$scope.usuario.errores.direccion = $scope.usuario.datos.direccion ? false : ($scope.usuario.datos.esPersona ? false : true);
				//caso tipo envio despacho
				if ($scope.usuario.datos.esDespacho()) {
					//valida direccion despacho
					$scope.usuario.errores.direccion_despacho = $scope.usuario.datos.direccion_despacho ? false : true;
					//valida region despacho
					$scope.usuario.errores.region_despacho = $scope.usuario.datos.region_despacho ? false : true;
					//valida comuna despacho
					$scope.usuario.errores.comuna_despacho = $scope.usuario.datos.comuna_despacho ? false : true;
				}

				/* fin validacion datos usuario */

				/* validacion opciones compra */

				//valida forma de envio seleccionada
				$scope.usuario.errores.tipo_envio = $scope.usuario.datos.tipo_envio ? false : true;
				//valida tienda para retiro seleccionada
				$scope.usuario.errores.tienda_retiro = $scope.usuario.datos.esDespacho() ? ($scope.usuario.datos.tienda_retiro ? false : true) : false;
				//validacion medio de pago seleccionado
				$scope.usuario.errores.medio_pago = $scope.usuario.datos.medio_pago ? false : true;

				/* fin validacion opciones compra */

				//respuesta implica que todas las validaciones son exitosas
				return $scope.usuario.errores.tipo === false &&
					$scope.usuario.errores.rut === false &&
					$scope.usuario.errores.nombre === false &&
					$scope.usuario.errores.giro === false &&
					$scope.usuario.errores.correo === false &&
					$scope.usuario.errores.telefono === false &&
					$scope.usuario.errores.direccion === false &&
					//validacion opciones de compra
					$scope.usuario.errores.tipo_envio === false &&
					$scope.usuario.errores.tienda_retiro === false &&
					$scope.usuario.errores.medio_pago === false &&
					//validacion caso tipo envio despacho domicilio
					(
						$scope.usuario.datos.esDespacho() ?
						(
							$scope.usuario.errores.direccion_despacho === false &&
							$scope.usuario.errores.region_despacho === false &&
							$scope.usuario.errores.comuna_despacho === false
						) : true
					);
			}
		},
		//indica que campos se deben marcar como error luego de la validacion
		errores: {
			//valores por defecto para errores es sin error (false)
			//errores para datos de usuario
			tipo: false,
			rut: false,
			nombre: false,
			giro: false,
			correo: false,
			telefono: false,
			direccion: false,
			//errores para datos despacho
			direccion_despacho: false,
			region_despacho: false,
			comuna_despacho: false,
			//errores para opciones de tienda
			tipo_envio: false,
			tienda_retiro: false,
			medio_pago: false
		},
		//indica pruducto guardados en el carro de compras
		carro: {
			//indica costo total
			precio_total: 0,
			precio_total_formato: function() {
				var nada = '-';
				var formato = formatCurrency.formatPesos($scope.usuario.carro.precio_total);
				return formato ? formato : nada;
			},
			//indica costo envio
			costo_envio_total: 0,
			costo_envio_total_formato: function() {
				var nada = '-';
				var formato = formatCurrency.formatPesos($scope.usuario.carro.costo_envio_total);
				return formato ? formato : nada;
			},
			calcula_costo_envio: function() {
				//costo de envio solo en caso tipo envio despacho domicilio
				if ($scope.usuario.datos.tipo_envio === 'despacho_domicilio') {
					$scope.usuario.carro.costo_envio_total = carroService.calcularDespacho($scope.comunaSeleccionada.factor);
				} else {
					$scope.usuario.carro.costo_envio_total = 0;
				}
			},
			cantidad_total: 0,
			items: []
		},
		config: {
			permite_credito: false,
			permite_khipu: false,
			permite_transferencia: false,
			url_checkout: '',
			id_tienda: 0
		}
	};
	/* inicia obtener datos asincronamente */
	//regiones y comunas
	$http.get('/api/despacho').success(function(data) {
		if (data && data.length <= 0) {
			console.log('error al obtener los datos de regiones y comunas para calculo costo despacho, array vacio');
			$state.go('carro');
		}
		$scope.regiones = data; //todas las regiones
		$scope.regionSeleccionada = $scope.regiones[0]; //seleccion
		$scope.comunaSeleccionada = $scope.regionSeleccionada.comunas[0];
		$scope.usuario.datos.region_despacho = $scope.regionSeleccionada.region; //datos modelo
		$scope.usuario.datos.comuna_despacho = $scope.comunaSeleccionada.comuna;
		//calcula costo despacho
		if ($scope.usuario.datos.tipo_envio === 'despacho_domicilio') {
			$scope.usuario.carro.costo_envio_total = carroService.calcularDespacho($scope.comunaSeleccionada.factor);
		} else {
			$scope.usuario.carro.costo_envio_total = 0;
		}
	}).error(function(err) {
		console.log('error al obtener los datos de regiones y comunar para calculo costo despacho');
		console.dir(err);
		$state.go('carro');
	});
	//obtiene carro de compras
	if ($localStorage) {
		//valida si existen items en carro de compras y si existen totales (no recalcula totales)
		if (
			$localStorage.carrito_productos &&
			$localStorage.carrito_productos.length > 0 &&
			$localStorage.carrito_cantidad &&
			$localStorage.carrito_cantidad > 0 &&
			$localStorage.carrito_total &&
			$localStorage.carrito_total > 0
		) {
			//obtiene datos carrito de compras
			$scope.usuario.carro.items = $localStorage.carrito_productos;
			$scope.usuario.carro.cantidad_total = $localStorage.carrito_cantidad;
			$scope.usuario.carro.precio_total = $localStorage.carrito_total;
		} else {
			//si no pasa validaciones redirecciona a pagina carro
			$state.go('/carro');
		}
	}
	//obtiene datos usuario sesion
	if ($cookieStore.get('token')) {
		$http.get('/api/users/me').success(function(data) {
			//agrega datos usuario logueado a modelo
			$scope.usuario.datos.importDatos(data, true);
		}).error(function(err) {
			console.dir(err);
			$state.go('/carro');
		});
	} else {
		console.dir('sin token asignado');
	}
	//obtiene datos tienda
	$http.get('api/tiendas').success(function(data) {
		if (data && data.length > 0 && data[0]) {
			var tienda = data[0];
			//configura metodos de pago disponibles en la tienda
			$scope.usuario.config.permite_webpay = tienda.permite_webpay;
			$scope.usuario.config.permite_credito = tienda.permite_credito;
			$scope.usuario.config.permite_khipu = tienda.permite_khipu;
			$scope.usuario.config.permite_transferencia = tienda.permite_transferencia;
			$scope.usuario.config.id_tienda = tienda._id;
			//recupera url checkout para llamar metodo init
			$scope.usuario.config.url_checkout = tienda.url_checkout;
		} else {
			console.log('información tienda no se puede recuperar');
			$state.go('/carro');
		}
	}).error(function(err) {
		console.dir(err);
		$state.go('/carro');
	});
	/* fin obtener datos asincronamente */
	//metodo para finalizar compra
	$scope.finalizarCompra = function() {
		//valida datos en pagina
		console.dir($scope.usuario);
		if ($scope.usuario.datos.validar()) {
			//carga datos para redirigir hacia checkout/init
			var checkout = {
				usuario: {
					_id: $scope.usuario.datos.id,
					accion: 'comprar',
					tipo_usuario: $scope.usuario.datos.esPersona ? 'user' : 'enterprice',
					run: $scope.usuario.datos.esPersona ? $scope.usuario.datos.rut : '',
					name: $scope.usuario.datos.esPersona ? $scope.usuario.datos.nombre : '',
					email: $scope.usuario.datos.correo,
					direccion: $scope.usuario.datos.direccion,
					telefono: $scope.usuario.datos.telefono,
					tipo_entrega: $scope.usuario.datos.tipo_envio === 'despacho_domicilio' ? 'Domicilio' : 'Tienda',
					direccion_despacho: $scope.usuario.datos.tipo_envio === 'despacho_domicilio' ? $scope.usuario.datos.direccion_despacho : '',
					region_despacho: $scope.usuario.datos.tipo_envio === 'despacho_domicilio' ? $scope.usuario.datos.region_despacho : '',
					comuna_despacho: $scope.usuario.datos.tipo_envio === 'despacho_domicilio' ? $scope.usuario.datos.comuna_despacho : '',
					giro: !$scope.usuario.datos.esPersona ? $scope.usuario.datos.giro : '',
					razon: !$scope.usuario.datos.esPersona ? $scope.usuario.datos.nombre : '',
					rut: !$scope.usuario.datos.esPersona ? $scope.usuario.datos.rut : '',
					tienda_entrega: $scope.usuario.datos.tipo_envio === 'despacho_domicilio' ? '' : $scope.usuario.datos.tienda_retiro
				},
				tienda: {
					_id: $scope.usuario.config.id_tienda
				},
				productos: $scope.usuario.carro.items
			};
			var checkout_string = JSON.stringify(checkout);
			$http.post('api/servicios/encriptar/checkout', checkout_string).success(function(checkout_encrypt) {
				var checkout_params = {
					g: checkout_encrypt
				};
				var checkout_post = $scope.usuario.config.url_checkout + 'Checkout/Init';
				$http.post(checkout_post, checkout_params).success(function(res) {
					if (res.status && res.status === 'JSON_CODE_STATUS_OK') {
						$scope.usuario.mensaje.crear_mensaje('Redirigiendo ...', 'success', false);
						var url = $scope.usuario.config.url_checkout +
							'Checkout/Index?q=' + res.q +
							'&t=' + res.t +
							'&u=' + res.u +
							'&r=' + $scope.usuario.datos.medio_pago;
						$window.open(url, '_self');
					} else {
						console.log('error interno en metodo inicializador de carro de compras');
						console.error(res);
						if (res.status && res.status === 'JSON_CODE_STATUS_ERROR') {
							$scope.usuario.mensaje.crear_mensaje('Error! No es posible conectar con el servidor. (' + res.mensaje + ')', 'danger', true);
						}
					}
				}).error(function(err) {
					console.log('error en metodo inicializador de carro en checkout manager');
					console.log(err);
					$scope.usuario.mensaje.crear_mensaje('Error! No es posible conectar con el servidor.', 'danger', true);
				});
			}).error(function(err) {
				console.log('error al encriptar datos json checkout');
				console.log(err);
				$scope.usuario.mensaje.crear_mensaje('Error! No es posible conectar con el servidor.', 'danger', true);
			});
		} else {
			console.log('errores de validacion');
			console.dir($scope.usuario.errores);
			$scope.usuario.mensaje.crear_mensaje('Ops! Verifique los campos obligatorios para poder continuar.', 'warning', true);
		}
	};
	//metodo para loguear usuario si lo solicita
	$scope.login = function(form) {
		//reinicia mensaje error en login
		$scope.usuario.login.mensaje_error = '';
		$scope.usuario.login.mensaje_danger = true;
		//valida formulario login
		if (form.$valid) {
			//loguea usuario en nueva sesion
			Auth.login({
				email: $scope.usuario.login.correo,
				password: $scope.usuario.login.password
			}).then(function() {
				//agrega datos carro de compra actual a usuario recien logueado
				if ($cookieStore.get('token')) {
					$http.get('/api/users/me').success(function(data) {
						//agrega datos usuario a formulario
						$scope.usuario.datos.importDatos(data, true);
						//agrega datos carro de compras a usuario
						$http.post('api/users/addcarro', {
							user: data,
							carrito: $localStorage
						}).success(function() {
							$scope.usuario.mensaje.crear_mensaje('Exito! Su sesión ha sido iniciada.', 'success', true);
						}).error(function(err) {
							console.log('error al agregar datos carro compra a usuario logueado (finalizar)');
							console.dir(err);
							//agrega mensaje advertencia
							$scope.usuario.mensaje.crear_mensaje('Ops! Ha ocurrido un error al registrar los datos de su carro de compra en nuestros servidores, sin embargo, el proceso de compra actual podrá ser realizado de forma normal, al finalizar su compra se completará el registro histórico de su carro.', 'warning', true);
						});
					}).error(function(err) {
						console.log('error al obtener usuario logueado nuevamente');
						console.dir(err);
						//agrega mensaje advertencia
						$scope.usuario.mensaje.crear_mensaje('Ops! Ha ocurrido un error al registrar los datos de su carro de compra en nuestros servidores, sin embargo, el proceso de compra actual podrá ser realizado de forma normal, al finalizar su compra se completará el registro histórico de su carro.', 'warning', true);
					});
				}
			}).catch(function(err) {
				console.log('error al ejecutar servicio login');
				console.dir(err);
				$scope.usuario.login.mensaje_danger = true;
				if (err && err.internal_code && (err.internal_code === 1 || err.internal_code === 2)) {
					//agrega mensaje de error
					$scope.usuario.mensaje.crear_mensaje(err.message, 'danger', true);
				} else {
					//agrega mensaje de error
					$scope.usuario.mensaje.crear_mensaje('En estos momentos presentamos dificultades técnicas, por favor intente ingresar nuevamente.', 'danger', true);
				}
			});
		}
	};
	//metodo para cerrar sesion de usuario
	$scope.logout = function() {
		//solo hace logout, no vacia carro de compras
		Auth.logout_finalizar();
		$scope.usuario.datos.id = '';
		$scope.usuario.login.estaLogueado = false;
		$scope.usuario.mensaje.crear_mensaje('La sesión ha finalizado exitosamente!', 'success', true);
	};
});
