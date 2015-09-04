'use strict';

angular.module('pruebaAngularApp', [
  'ngCookies', 
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'ngStorage', 
  'angulartics', 
  'angulartics.google.analytics',
  'wu.masonry',
  'ui-rangeSlider'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $analyticsProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
    $analyticsProvider.firstPageview(true); /* Records pages that don't use $state or $route */
    $analyticsProvider.withAutoBase(true);  /* Records full path */
  })

  .filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    };
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          //los path que aparecen el el if corresponden a excepciones de error 401 (paginas de login/registro)
          //todas las demas paginas, al detectar un 401, debe rediriguir al usuario hacia main
          if ($location.path() !== '/login' && $location.path() !== '/checkout/comprar' && $location.path() !== '/checkout/cotizar') {
            $location.path('/');
          }
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  }) 

  .factory('formatCurrency', function(){
    return{
      format: function(input)
      {
        var num = input;
        if(!isNaN(num)){
          num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
          num = num.split('').reverse().join('').replace(/^[\.]/,'');          
          return num;
        }        
      }
    };
  }) 

  .factory('validarRut', function(){
    return{
      validar: function (rut){ 
        if(rut){
          if (rut.length <  9){
            return false;
          }

          var i1 = rut.indexOf('-');
          var dv = rut.substr(i1 + 1);
          dv = dv.toUpperCase();
          var nu = rut.substr(0, i1);
         
          var cnt = 0;
          var suma = 0;

          for (var i = nu.length - 1; i >= 0; i--){
            var dig = nu.substr(i,1);
            var fc = cnt + 2;
            suma += parseInt(dig) * fc;
            cnt = (cnt + 1) % 6;
          }
          var dvok = 11 - (suma % 11);
          var dvokstr = '';
          if (dvok === 11) {
            dvokstr = '0';
          }
          if (dvok === 10) {
            dvokstr = 'K';
          }
          if ((dvok !== 11) && (dvok !== 10)) {
            dvokstr = '' + dvok;
          }
         
          if (dvokstr === dv){
            return true;
          }
          else{
            return false;
          }

        }     
        
      }
    };
  }) 

  .factory('carroService', function ($localStorage, $http, $cookieStore, formatCurrency) {
    return {
      add: function (producto, cantidad, variantes, precio, elegido) {

        console.dir(producto);
        console.dir(cantidad);
        console.dir(variantes);
        console.dir(precio);
        console.dir(elegido);

        if(cantidad !== 0 && cantidad !== undefined){
          console.log('carroService .. add()');  
          var usuario = {} ;     
          var store = $localStorage.$default({
            carrito_productos: [], //json con productos
            carrito_cantidad: 0, // cantidad de productos .. cuenta todos los productos
            carrito_total: 0, //total precios .. todos los productos
            cotizacion_producto: []
          });

          var subtotal_temp = 0;
          subtotal_temp = parseInt(precio) * cantidad;
          
          //si carrito esta vacio .. inicializa
          if (!(store.carrito_productos && store.carrito_productos.length !== 0)){
            store.carrito_productos = [];
          }

          //busca si producto ya existe en carrito de compra
         var repetido = _.find(store.carrito_productos, function(item){
            //console.dir(item);
            //console.dir(producto);
            if (item.id_producto === producto._id && item.codigo === elegido.codigo_sku){
              return true;
            }
            else{
              return false;
            }
          });     
          
                    
          //si producto esta repetido .. solo aumenta la cantidad del producto y su subtotal
          //además aumenta la cantidad y total global
          if (repetido){
            store.carrito_total = store.carrito_total + (parseInt(precio) * parseInt(cantidad));         
            store.carrito_cantidad = store.carrito_cantidad + parseInt(cantidad);
            repetido.precio_total = repetido.precio_total + subtotal_temp;
            repetido.precio_total_formato = formatCurrency.format(repetido.precio_total);
            repetido.cantidad  = parseInt(repetido.cantidad) + parseInt(cantidad);
            
          //si no, lo agrega al carro también actualizando la cantidad y el total
          //del producto y globales
          } else {          
            store.carrito_productos.push({
              id_producto: producto._id,
              url_imagen: 'assets/producto/small_'+producto.images[0],
              nombre: producto.nombre,
              descripcion: producto.descripcion,
              variante: variantes,              
              precio_unitario: parseInt(precio),
              precio_unitario_formato: formatCurrency.format(parseInt(precio)),
              cantidad: cantidad,
              precio_total: subtotal_temp,
              precio_total_formato: formatCurrency.format(subtotal_temp),
              codigo: elegido.codigo_sku,
              stock: elegido.stock,              
              sobrestock: false              
            });           

            store.carrito_total = store.carrito_total + (parseInt(precio) * parseInt(cantidad));
            store.carrito_cantidad = store.carrito_cantidad + parseInt(cantidad); 
            //console.dir(store.carrito_productos);   
          }  
          if($cookieStore.get('token')) {
            $http.get('/api/users/me')
              .success(function(user){
                usuario = user;
                $http.post('api/users/addcarro', {
                  user: usuario, 
                  carrito: store
                });
              });
            }         
          return;
        }
      },
     
      remove: function(producto){
        console.log('carroService .. remove()');
        //carga en store todos los datos del carro que estan el localstorage
        var usuario = {};
        var store = $localStorage;
       
        console.dir(store.carrito_productos.length);

        //busca en todos los productos del carro
        for(var i = 0; i <= store.carrito_productos.length -1; i++){          
        
              //si encuentra el producto que se quiere borrar
              if(store.carrito_productos[i].id_producto === producto.id_producto && store.carrito_productos[i].variante === producto.variante){
                //se disminuye el total y la cantidad global
                store.carrito_total = store.carrito_total - store.carrito_productos[i].precio_total;
                store.carrito_cantidad = store.carrito_cantidad - store.carrito_productos[i].cantidad;
                //se disminuye el total del producto a cero
                store.carrito_productos[i].precio_total = 0;
                //se disminuye su cantidad a cero            
                store.carrito_productos[i].cantidad = 0;
                //se elimina el producto del carro
                store.carrito_productos.splice(i, 1);        
              }
        } 
        console.dir(store); 
        if($cookieStore.get('token')) {
            $http.get('/api/users/me')
              .success(function(user){
                usuario = user;
                $http.post('api/users/addcarro', {
                  user: usuario, 
                  carrito: store
              });
            });
        }        
      },

      update: function(cantidad, productos, total){
        $localStorage.carrito_cantidad = cantidad;
        $localStorage.carrito_productos = productos;
        $localStorage.carrito_total= total;        
      },

      cotizar: function (producto, cantidad, variantes, elegido) {

        console.dir(producto);
        console.dir(cantidad);
        console.dir(variantes);
        console.dir(elegido);

        if(cantidad !== 0 && cantidad !== undefined){
          console.log('carroService .. add()');  
          var usuario = {} ;     
          var store = $localStorage.$default({           
            cotizacion_producto: [],
            cotizacion_cantidad: 0
          });
          
          //si carrito esta vacio .. inicializa
          if (!(store.cotizacion_producto && store.cotizacion_producto.length !== 0)){
            store.cotizacion_producto = [];
          }

          //busca si producto ya existe en carrito de compra
         var repetido = _.find(store.cotizacion_producto, function(item){
            //console.dir(item);
            //console.dir(producto);
            if (item.id_producto === producto._id && item.codigo === elegido.codigo_sku){
              return true;
            }
            else{
              return false;
            }
          });     
          
                    
          //si producto esta repetido .. solo aumenta la cantidad del producto y su subtotal
          //además aumenta la cantidad y total global
          if (repetido){                    
            store.cotizacion_cantidad = store.cotizacion_cantidad + parseInt(cantidad);            
            repetido.cantidad  = parseInt(repetido.cantidad) + parseInt(cantidad);
            
          //si no, lo agrega al carro también actualizando la cantidad y el total
          //del producto y globales
          } else {          
            store.cotizacion_producto.push({
              id_producto: producto._id,
              url_imagen: 'assets/producto/small_'+producto.images[0],
              nombre: producto.nombre,
              descripcion: producto.descripcion,
              variante: variantes,
              cantidad: cantidad,
              codigo: elegido.codigo_sku,
              stock: elegido.stock,              
              sobrestock: false              
            });           

            store.cotizacion_cantidad = store.cotizacion_cantidad + parseInt(cantidad); 
            //console.dir(store.carrito_productos);   
          }  
          if($cookieStore.get('token')) {
            $http.get('/api/users/me')
              .success(function(user){
                usuario = user;
                $http.post('api/users/addcarro', {
                  user: usuario, 
                  carrito: store
                });
              });
            }         
          return;
        }
      },

      removeCotizacion: function(producto){
        console.log('carroService .. remove()');
        //carga en store todos los datos del carro que estan el localstorage
        var usuario = {};
        var store = $localStorage;
        console.dir(store);
        console.dir(store.cotizacion_producto.length);

        //busca en todos los productos del carro
        for(var i = 0; i <= store.cotizacion_producto.length -1; i++){          
        
              //si encuentra el producto que se quiere borrar
              if(store.cotizacion_producto[i].id_producto === producto.id_producto && store.cotizacion_producto[i].variante === producto.variante){
                //se disminuye  la cantidad global                
                store.cotizacion_cantidad = store.cotizacion_cantidad - store.cotizacion_producto[i].cantidad;                
                //se disminuye su cantidad a cero            
                store.cotizacion_producto[i].cantidad = 0;
                //se elimina el producto del carro
                store.cotizacion_producto.splice(i, 1);        
              }
        }  
        if($cookieStore.get('token')) {
            $http.get('/api/users/me')
              .success(function(user){
                usuario = user;
                $http.post('api/users/addcarro', {
                  user: usuario, 
                  carrito: store
              });
            });
        }        
      },
    };
  })

  .directive('rut', ['validarRut', function(validarRut) {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$validators.rut = function(modelValue, viewValue) {
          if (ctrl.$isEmpty(modelValue)) {
            return true; // caso en que el modelo esta vacio
          }
          if (viewValue && validarRut.validar(viewValue)) {
            return true;
          }
          return false;
        };
      }
    };
  }])
  
  .run(function ($rootScope, $location, Auth, $localStorage) {
    // Redirect to login if route requires auth and you're not logged in
    $localStorage.$default({
            carrito_productos: [], //json con productos
            carrito_cantidad: 0, // cantidad de productos .. cuenta todos los productos
            carrito_total: 0, //total precios .. todos los productos
            cotizacion_producto: [],
            cotizacion_cantidad: 0
    });
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });

                