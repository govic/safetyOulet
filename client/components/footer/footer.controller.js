'use strict';

angular.module('pruebaAngularApp')
  .controller('FooterCtrl', function ($scope, $http) {

    //console.log('inicia footer ...');

    $scope.categorias = [];
    
    $http.get('/api/filtros/menu')
      .success(function(categorias){
        
        //selecciona categorias y que no dependen de otros
        var categorias_root = _.filter(categorias, function(fil){
          
          return fil.es_menu_filtro === true && fil.dependencias_filtro[0] === null;
        });        
        //agrega categorias root a tree
        _.each(categorias_root, function(fil){
          $scope.categorias.push({item: fil, childs: [] });
        });  
        //console.dir($scope.categorias);
        //console.dir(categorias_root);  
        //funcion recursiva que agrega todos los child al tree de categorias, solo si existen.
        //IMPORTANTE: si existe una llamada circular se cae de guata ..
        var add_childs = function(tree_item){

          //busca hijos (dependencias)
          var categoria_childs = _.filter(categorias, function(fil){            
            if(fil.dependencias_filtro[0] !== null) {              
              return _.contains(fil.dependencias_filtro[0], tree_item.item._id);
            }
          });
          //console.dir(categoria_childs);               
          // si existen hijos, los agrega al arbol
          if (categoria_childs && categoria_childs.length > 0){

            _.each(categoria_childs, function(child){
              //crea objeto tree para agregar
              var child_to_add = { item: child, childs: [] };
              //busca dependecias recursivamente
              add_childs(child_to_add);
              //agrega el obj a tree junto con el arbol obtenido por recursividad
              tree_item.childs.push(child_to_add);
            });
          }
        };

        //agrega childs para todos los filtros root
        _.each($scope.categorias, function(tree_root){
          add_childs(tree_root);
        });
      })
      .error(function(){
        //TODO: en caso de error
      });

  });