'use strict';

angular.module('pruebaAngularApp').controller('NavbarCtrl', function($state, $cookieStore, $scope, $location, Auth, $http, $localStorage, $rootScope) {

  $scope.categorias = [];
  $scope.isCollapsed = true;
  $scope.isLoggedIn = Auth.isLoggedIn;
  $scope.isAdmin = Auth.isAdmin;
  $scope.getCurrentUser = Auth.getCurrentUser;
  $scope.tag = [];
  $scope.show_cart = false;
  var usuario = {};
  var orden = false;

  $scope.carro = $localStorage;
  //console.dir($scope.cantidad); 
  if ($scope.carro.carrito_cantidad > 0) {
    $scope.show_cart = true;
  }

  $scope.pasarTags = function() {
    console.log('pasarTags()');
    console.dir($scope.tag);
    $location.path('/busqueda/' + $scope.tag);
    $scope.tag = [];

  };

  $scope.ordenar = function() {
    if (!orden) {
      console.log('aqui ordenar');
      $rootScope.$broadcast('masonry.reload');
      orden = true;
    }
  };

  $scope.goToProfile = function() {
    if ($cookieStore.get('token')) {
      $http.get('/api/users/me')
        .success(function(user) {
          usuario = user;
          if (usuario._id) {
            var usuario_id_json = angular.toJson(usuario._id);
            var encodedData = window.btoa(usuario_id_json);
            $state.go('perfil', {
              user_id: encodedData
            });
          }
        });
    }
  };

  $scope.logout = function() {
    Auth.logout();
    $localStorage.$default({
      carrito_productos: [], //json con productos
      carrito_cantidad: 0, // cantidad de productos .. cuenta todos los productos
      carrito_total: 0, //total precios .. todos los productos
      cotizacion_producto: [],
      cotizacion_cantidad: 0
    });
    $location.path('/');
  };

  $scope.isActive = function(route) {
    return route === $location.path();

  };

  $http.get('/api/filtros/actividades').success(function(actividades) {
      $scope.actividades = actividades;
    });

  $http.get('/api/filtros/marcas').success(function(marcas) {
      $scope.marcas = marcas;
    });

  //obtiene menu categorias
  $http.get('/api/filtros/menu').success(function(categorias) {

      //selecciona categorias y que no dependen de otros
      var categorias_root = _.filter(categorias, function(fil) {
        return fil.es_menu_filtro === true && fil.dependencias_filtro[0] === null;
      });

      //agrega categorias root a tree
      _.each(categorias_root, function(fil) {
        $scope.categorias.push({
          item: fil,
          childs: []
        });
      });

      //console.dir(categorias_root);  
      //funcion recursiva que agrega todos los child al tree de categorias, solo si existen.
      //IMPORTANTE: si existe una llamada circular se cae de guata ..
      var add_childs = function(tree_item) {

        //busca hijos (dependencias)
        var categoria_childs = _.filter(categorias, function(fil) {
          if (fil.dependencias_filtro[0] !== null) {
            return _.contains(fil.dependencias_filtro[0], tree_item.item._id);
          }
        });
        
        // si existen hijos, los agrega al arbol
        if (categoria_childs && categoria_childs.length > 0) {

          _.each(categoria_childs, function(child) {

            //crea objeto tree para agregar
            var child_to_add = {
              item: child,
              childs: []
            };

            //busca dependecias recursivamente
            add_childs(child_to_add);

            //agrega el obj a tree junto con el arbol obtenido por recursividad
            tree_item.childs.push(child_to_add);
          });
        }
      };

      //agrega childs para todos los filtros root
      _.each($scope.categorias, function(tree_root) {
        add_childs(tree_root);
      });
    })
    .error(function() {
      //TODO: en caso de error
    });

});
