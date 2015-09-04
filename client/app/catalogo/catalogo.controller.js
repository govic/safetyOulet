'use strict';

angular.module('pruebaAngularApp')
	.controller('CatalogoCtrl', function ($timeout, $anchorScroll, $scope, $stateParams, $http, $log, $cookieStore, $location, formatCurrency) {
		$anchorScroll('top');
		//$log.debug('Inicia .. CatalogoCtrl');
		if($cookieStore.get('token')){
            $http.get('/api/users/me')
              .success(function(user){
                             
                var path = $location.path();
                var tipo_usuario = '';
	            if(user.role === 'enterprise'){
	                tipo_usuario = 'empresa';
	            }
	            else{
	                tipo_usuario = 'persona';
	            }
                //console.dir(usuario);
                //console.dir(path);  
                var contenido = path.split('/');                
                var elemento = contenido[2];
                //console.dir(tipo);
                //console.dir(elemento);                
            	$http.get('/api/filtros/' + elemento)
            		.success(function(data){
            			var id = data._id;							
						var filtro = data.glosa_filtro;
						//console.dir(filtro);
						$http.post('api/trackings', {
							usuario_id: user._id, 
							usuario_nombre: user.name || user.razon, 
							usuario_correo: user.email,
							usuario_tipo: tipo_usuario,
							tipo_elemento: 'filtro',
							id_elemento: parseInt(id),
							elemento: filtro,
							fecha: new Date()
						});
					});
				
			});
        } 
		//lista de filtros que aparecen en sidebar
		$scope.tree = [];

		//muestra filtros que componen query productos
		$scope.filtros_activos = [];

		//muestra banner categoria
		$scope.banner = [];

		//muestra lista de productos obtenidos con query filtros
		$scope.productos = [];
		$scope.reserva = [];

		//contiene la query con la que se buscaran los productos por filtros seleccionados
		$scope.query = [];

		//contiene la ruta
		$scope.ruta = [];

		//variable global utilizada para guardar resultado busqueda - findItem
		$scope.tree_item_buscado = null;

		//atributos de los productos mostrados actualmente
		
		$scope.atributos_activos = [];

		//variable para guardar productos destacados
		$scope.destacados = [];
		$scope.opciones = [9, 15, 21];

		$scope.productos_filtrados = [];
		$scope.productos_pagina = [];
		$scope.pagina_actual = 1;	
		$scope.numero_por_pagina = $scope.opciones[0];		
		$scope.maxSize = 5;	
		$scope.precios = [];	
		$scope.opcion = '';		
		
		$http.post('api/producto/getpreciosminmax')
		.success(function(data){
			console.dir(data);
			$scope.min_price = data[0];
			$scope.max_price = data[1];
			$scope.min = _.clone($scope.min_price);
			$scope.max = _.clone($scope.max_price);
			$scope.min_format = formatCurrency.format($scope.min);
			$scope.max_format = formatCurrency.format($scope.max);
		});
		$scope.$watch('min + max', function(){
			$scope.min_format = formatCurrency.format($scope.min);
			$scope.max_format = formatCurrency.format($scope.max);
		});		

  		var getProductosByQuery = function(){
			//$log.debug('CatalogoCtrl .. getProductosByQuery');
			
			$http
			//hacia el server envia solo los ids de filtros
			.post('/api/producto/query', _.pluck($scope.filtros_activos, '_id'))
			.success(function(data){
				//$log.debug('CatalogoCtrl .. getProductosByQuery');
				//retorna lista de productos ya fitlrados
				$scope.prod1 = _.clone(data);
				$scope.productos = data;	
				$scope.atributos_activos = [];				
				mostrarAtributos();	
				$scope.filtrarPrecio($scope.productos);		
				//console.dir($scope.productos);					
			});
		};		

		var filtrarByAtributos = function(){
			console.log('Inicia filtrar por atributo');
			$http.post('api/producto/atr', $scope.atributos_activos).
			success(function(data){
				$scope.prod2 = _.clone(data);
				$scope.productos = data;
				$scope.filtrarPrecio($scope.productos);							
			});
		};

		$scope.filtrarPrecio = function(productos){
			/*$scope.productos_precio = _.filter($scope.productos, function(producto){
				return producto.precio >= $scope.min && producto.precio <= $scope.max;
			});*/
			console.log('filtrarPrecio');
			$scope.productos_precio = [];
			//console.log('2');
			_.each(productos, function(producto){				
				if(producto.precio >= $scope.min && producto.precio <= $scope.max){
					//console.log('4');
					$scope.productos_precio.push(producto);
				}				
			});
			//console.log('6');
			console.dir($scope.productos_precio);
			//console.log('7');
			$scope.pagina_actual = 1;
			$scope.ordenarFunction($scope.productos_precio);
		};

		$scope.ordenarFunction = function(productos){
			console.log('Inicia ordenar productos function');
			
			//ordena productos alfabéticamente por el nombre
			if($scope.opcion === 'precio_asc'){
				productos = _.sortBy(productos, function(ordenado_precio){
					return +ordenado_precio.precio;					
				});			
			}
			//ordena productos por precio en orden descendente
			else if($scope.opcion === 'precio_desc'){
				productos = _.sortBy(productos, function(ordenado_precio){
					return +ordenado_precio.precio;					
				});
				productos.reverse();
				//console.dir($scope.productos);
			}
			else{
				console.log('sin ordenar');
			}
			$scope.pagina_actual = 1;	
			mostrarProductos(productos);
		};

		//$scope.opcion= '';
		//ordena los productos segun la opcion ingresada
		$scope.$watch('opcion', function(opcion) {		    
			//console.dir($scope.productos);
			if($scope.productos_precio && $scope.productos_precio.length !== 0){
				console.log('Inicia ordenar productos watch');
				//console.dir(opcion);
				//ordena productos alfabéticamente por el nombre
				if(opcion === 'precio_asc'){
					$scope.productos_precio = _.sortBy($scope.productos_precio, function(ordenado_precio){
						return +ordenado_precio.precio;					
					});			
				}
				//ordena productos por precio en orden descendente
				else if(opcion === 'precio_desc'){
					$scope.productos_precio = _.sortBy($scope.productos_precio, function(ordenado_precio){
						return +ordenado_precio.precio;					
					});
					$scope.productos_precio.reverse();
					//console.dir($scope.productos);
				}
				else{
					console.log('error al ordenar productos');
				}
				$scope.pagina_actual = 1;	
				mostrarProductos($scope.productos_precio);
			}			
		});

		var mostrarProductos = function(productos){	
			console.log('aqui mostrar productos');		
			$scope.pagina_actual = 1;
			var inicio = 0;
			var fin = 0;
			$scope.$watch('numero_por_pagina', function(){
				$scope.pagina_actual = 1;
			});			
			$scope.$watch('pagina_actual + numero_por_pagina', function(){
				console.log('aqui mostrar productos watch pagina');
				inicio = (($scope.pagina_actual - 1) * $scope.numero_por_pagina);				
				fin = inicio + parseInt($scope.numero_por_pagina);	

				$scope.productos_filtrados = productos.slice(inicio, fin);

				_.each($scope.productos_filtrados, function(producto_filtrado){
					if(producto_filtrado.precio){
						$scope.precio_formato = _.clone(producto_filtrado.precio);
						$scope.precio_formato = formatCurrency.format($scope.precio_formato);
						producto_filtrado.precio_formato = $scope.precio_formato;	
						producto_filtrado.stock_disponible = false;
						_.each(producto_filtrado.stock, function(stock){
							if(stock.stock >= 0){
								producto_filtrado.stock_disponible = true;
							}
						});					
					}					
				});
				console.dir($scope.productos_filtrados);							
			});
			inicio = (($scope.pagina_actual - 1) * $scope.numero_por_pagina);				
			fin = inicio + parseInt($scope.numero_por_pagina);	
			$timeout(function() {
				$scope.productos_filtrados = productos.slice(inicio, fin);

				_.each($scope.productos_filtrados, function(producto_filtrado){
					if(producto_filtrado.precio){
						$scope.precio_formato = _.clone(producto_filtrado.precio);
						$scope.precio_formato = formatCurrency.format($scope.precio_formato);
						producto_filtrado.precio_formato = $scope.precio_formato;						
					}					
				});
			});
			console.dir($scope.productos_filtrados);
		};

		//recupera atributos de los productos mostrados actualmente.
		var mostrarAtributos = function(){
			
			$scope.atributos = [];		

			_.each($scope.productos, function(producto){
				//console.dir(producto);
				if(producto.atributos && producto.atributos.length !== 0){
					_.each(producto.atributos, function(atr){
						//console.dir(atr);
						$scope.atributos.push(atr);
					});
				}
			});				

			$scope.atributos = _.uniq($scope.atributos, false, function(data){
				return data._id;
			});
			//console.dir($scope.atributos);
			$scope.atributos_mostrar = [];
			_.each($scope.atributos, function(original){
				var repetido = false;
				var unico = false;

				if($scope.atributos_mostrar.length === 0){

					$scope.atributos_mostrar.push(original);
				}
				else{
					_.each($scope.atributos_mostrar, function(mostrar){
						if(mostrar.nombre_atributo === original.nombre_atributo){
							//console.log('los nombres son iguales');
							if( !(_.contains(mostrar.especificacion, original.especificacion[0]))){
								mostrar.especificacion.push(original.especificacion[0]);
								//var a = _.clone(mostrar.especificacion);
								//console.dir(a);
							}	
							repetido = true;
							//console.log('repetido: '+repetido)	;										
						}
						else{	
							//console.log('los nombres NOOOO son iguales');						
							unico = true;	
							//console.log('unico: '+unico)	;				
						}
					});

					if(repetido === false && unico === true){
						$scope.atributos_mostrar.push(original);
						//var a = _.clone($scope.atributos_mostrar);
						//console.dir(a);
					}
				}	
			});			
			//console.dir($scope.atributos_mostrar);
		};

		//guarda la ruta de acceso
		$http.get('api/filtros/'+ $stateParams.id_catalogo)
		.success(function(data){

			var parte_ruta = data;
			//console.dir(parte_ruta);
			var ultimo = data;
			//console.dir(parte_ruta.dependencias_filtro[0]);
			if(parte_ruta.dependencias_filtro[0] !== null && parte_ruta.dependencias_filtro[0].es_menu_filtro === true){
				while(parte_ruta.dependencias_filtro[0] !== null){
					$scope.ruta.push(parte_ruta.dependencias_filtro[0]);
					//console.dir($scope.ruta);
					parte_ruta = parte_ruta.dependencias_filtro[0];
					//console.dir(parte_ruta);
				}
			}
			$scope.ruta.push(ultimo);
			//console.dir($scope.ruta);
		});

		//obtiene productos destacados para la categoria
		$http.get('api/filtros/'+ $stateParams.id_catalogo + '/destacados')
			.success(function(data){
			$scope.destacados = data;
			//console.dir($scope.destacados);
		});	

		//obtiene lista de filtros sidebar
		//$log.debug('CatalogoCtrl .. $http.get(/api/filtros/sidebar)');
		$http.get('/api/filtros/sidebar')
		.success(function(filtros_sidebar){

			//$log.debug('CatalogoCtrl .. $http.get(/api/filtros/sidebar) .. OK');				
			//agrega flag collapsable a todos los item del menu
			var default_collapse = true;
			var default_checked = false;

			//selecciona filtros que son categoria y que no dependen de otros
			var filtros_root = _.filter(filtros_sidebar, function(fil){
				return fil.es_menu_filtro === true && fil.dependencias_filtro[0] === null;
			});

			//agrega filtros root a tree
			_.each(filtros_root, function(fil){
				$scope.tree.push({
					item: fil,
					childs: [],
					collapse: default_collapse,
					checked: default_checked,
					parent: null
				});
			});
			//console.dir(filtros_root);


			//funcion recursiva que agrega todos los child al tree, solo si existen.
			//IMPORTANTE: si existe una llamada circular se cae de guata ..
			var add_childs = function(tree_item){

				//busca hijos (dependencias)
				var filtro_childs = _.filter(filtros_sidebar, function(fil){
					if(fil.dependencias_filtro[0] !== null){
						return _.contains(fil.dependencias_filtro[0], tree_item.item._id);
					}
				});
				//console.dir(filtro_childs);

				// si existen hijos, los agrega al arbol
				if (filtro_childs && filtro_childs.length > 0){


					_.each(filtro_childs, function(child){
						//crea objeto tree para agregar
						var child_to_add = { 
							item: child, 
							childs: [],
							collapse: default_collapse,
							checked: default_checked,
							parent: tree_item.item._id
						};						
						//busca dependecias recursivamente
						add_childs(child_to_add);
						//agrega el obj a tree junto con el arbol obtenido por recursividad
						tree_item.childs.push(child_to_add);
					});
				}
			};
			
			//agrega childs para todos los filtros root
			_.each($scope.tree, function(tree_root){
				add_childs(tree_root);
			});
						
			//console.dir($scope.tree);
			//funcion que recorre el arbol de categorias y marca visibles solo las que dependen de cat id
			var tree_cut = []; 
			var cut_childs = function(tree_item, encontrado){
				//verifica si nodo es categoria ..
				if (!encontrado){		

					if (tree_item.item._id === parseInt($stateParams.id_catalogo)){
						//console.dir(tree_item.item._id);
						//console.dir($stateParams.id_catalogo);
						//busca banner categoria
						$scope.banner = tree_item.item;
						//console.dir($scope.banner);
						//corta padre de elemento encontrado .. nuevo head
						tree_item.parent = null;
						//console.dir(tree_item);
						//guarda nuevo arbol
						tree_cut.push(tree_item);
						//console.dir(tree_cut);
						return;
					} else {
						//si nodo no es la categoria
						_.each(tree_item.childs, function(child){
							cut_childs(child, false);
						});
					}
				}
			};
			//corta ramas que no deben ser visibles
			_.each($scope.tree, function(tree_root){
				cut_childs(tree_root);
			});

			//asigna rama visible a tree
			$scope.tree = tree_cut;

			//console.dir($scope.tree);
			
			//hace check al elemento pinchado desde el navbar
			$scope.tree[0].checked = true;
			//hace la consulta para el elemento pinchado
			$scope.filtroChecked($scope.tree[0]);
			
		})
		.error(function(){
			//$log.debug('Error al cargar filtros para categoria id: ' + $stateParams.id_catalogo);
		});
		

		//metodo que retorna los productos segun la query de filtros		

		$scope.checkAtributo = function(especificacion, ch){
			console.log('Inicia verificacion de check atributo');
			var atributo = {
				item: especificacion,
				checked: ch
			};
			console.dir(atributo);

			if(atributo.checked && atributo.checked === true){
				$scope.atributos_activos.push(atributo.item);
			}
			else{

				$scope.atributos_activos = _.without($scope.atributos_activos, atributo.item);
			}
			console.dir($scope.atributos_activos);
			console.dir($scope.atributos_activos.length);

			if($scope.atributos_activos.length === 0){
				getProductosByQuery();
			}
			else{
				filtrarByAtributos();
			}
		};
		// *********************************** //
		// Metodos para arbol de filtros       //
		// *********************************** //

		//descamarca todos los hijos de un nodo
		var uncheckChilds = function(tree_item){
			//$log.debug('CatalogoCtrl .. uncheckChilds');

			//verifica si item tiene hijos .. condicion de parada
			if (tree_item && tree_item.childs && tree_item.childs.length !== 0){
				_.each(tree_item.childs, function(child){
					
					//descheckea hijo
					child.checked = false;
					
					//quita hijo de array filtros activos
					$scope.filtros_activos = _.without($scope.filtros_activos, child.item);

					//actualiza query .. elimina filtro deschekeado
					//$log.debug('.. elimina id filtro de query ('+child.item.glosa_filtro+': '+child.item._id+')');
					$scope.query = _.without($scope.query, child.item._id);
					
					//repite proceso recursivamente para hijos del hijo
					uncheckChilds(child);
				});
			}
		};
		//desmarca todos los padres de un nodo
		//ademas, la funcion guarda todos los padres en query para obtener los productos
		var uncheckParents = function(tree_item){
			//$log.debug('CatalogoCtrl .. uncheckParents');

			//verifica si item tiene padres .. condicion de parada
			if (tree_item && tree_item.parent){
				//IMPORTANTE: item.parent es solamente el id del padre
				//busca padre por id parent
				//busca en todas las raices .. solo si exisnte varias
				_.each($scope.tree, function(tree_item_root){
					findItem(tree_item.parent, tree_item_root);
					//elemento encontrado queda en variables global $scope.tree_item_buscado
				});

				if ($scope.tree_item_buscado){
					
					//descheckea padre
					$scope.tree_item_buscado.checked = false;

					//quita padre de array filtros activos
					//$log.debug('.. elimina filtro activo');
					$scope.filtros_activos = _.without($scope.filtros_activos, $scope.tree_item_buscado.item);

					//actualiza query .. agrega todos los padres a la consulta
					//$log.debug('.. agrega id filtro a query ('+$scope.tree_item_buscado.item.glosa_filtro+': '+$scope.tree_item_buscado.item._id+')');
					$scope.query.push($scope.tree_item_buscado.item._id);

					//deschekea recursivamente el padre del padre
					uncheckParents($scope.tree_item_buscado);
				}
			}
		};
		//busca un nodo de tree con id del nodo, retorna nodo
		var findItem = function(item_id, root_item){
			//$log.debug('CatalogoCtrl .. findItem');

			//verifica si item es el que se esta buscando
			if (root_item && root_item.item  && root_item.item._id === item_id){
				//item encontrado
				//guarda elemento encontrado en variable global
				$scope.tree_item_buscado = root_item;
			} else {
				//item no encontrado
				//verifica si el item tiene hijos para seguir buscando
				if (root_item && root_item.childs && root_item.childs.length !== 0){
					//busca recursivamente en cada hijo
					_.each(root_item.childs, function(child){
						findItem(item_id, child);
					});
				}
			}
			//IMPORTANTE: metodo realiza una busqueda exaustiva desde root, el metodo no se detiene cuando encuentra el resultado
		};
		
		//funcion que se encarga de armar array de filtros para obtener productos
		$scope.filtroChecked = function(filtro_item){
			//$log.debug('CatalogoCtrl .. filtroChecked');

			if (filtro_item.checked && filtro_item.checked === true){
				
				//agrega filtro activado a la query
				//$log.debug('.. agrega filtro activo');
				$scope.filtros_activos.push(filtro_item.item);

				//actualiza query .. agrega solo ids de filtros
				//$log.debug('.. agrega id filtro a query ('+filtro_item.item._id+')');
				$scope.query.push(filtro_item.item._id);

				//busca hijos y los marca false
				uncheckChilds(filtro_item);

				//busca padres y los marca false
				uncheckParents(filtro_item);
			} else if (filtro_item.checked === false) {

				//elimina filtro
				//$log.debug('.. elimina filtro activo');
				$scope.filtros_activos = _.without($scope.filtros_activos, filtro_item.item);

				//actualiza query .. elimina filtro deschekeado
				//$log.debug('.. elimina id filtro de query ('+filtro_item.item._id+')');
				$scope.query = _.without($scope.query, filtro_item.item._id);
			}
			//elimina filtros duplicados
			$scope.filtros_activos = _.uniq($scope.filtros_activos);
			$scope.query = _.uniq($scope.query);
			
			//FIX: error al utilizar metodo reduce con array length = 1
			if ($scope.query.length === 0){
				//$log.debug('.. query = {null}');
			} else {
				$log.debug('.. query = {'+_.reduce($scope.query, function(memory, q){
					return memory+', '+q;
				})+'}');
			}
			//obtiene lista de productos
			getProductosByQuery();								
		};	

		//funcion que deschekea los filtros activos
		$scope.deleteFiltroActivo = function(filtro_activo){
			//$log.debug('CatalogoCtrl .. deleteFiltroActivo');

			//elimina filtro de query
			$scope.filtros_activos = _.without($scope.filtros_activos, filtro_activo);

			//deschequea item .. busca por id
			_.each($scope.tree, function(tree_root){
				findItem(filtro_activo._id, tree_root);
			});
			$scope.tree_item_buscado.checked = false;
			
			//busca hijos y los marca false
			uncheckChilds(filtro_activo);

			//busca padres y los marca false
			uncheckParents(filtro_activo);

			//obtiene lista de productos
			getProductosByQuery();	
			
		};		
	});
