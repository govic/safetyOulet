'use strict';

var _ = require('lodash');
var Producto = require('./producto.model');
var Atributo = require('../atributo/atributo.model');
var util = require('util');

// Get list of productos
exports.index = function(req, res) {
  Producto.find(function(err, productos) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, productos);
  });
};

// Get a single producto
exports.show = function(req, res) {
  Producto.findById(req.params.id, function(err, producto) {
    if (err) {
      return handleError(res, err);
    }
    if (!producto) {
      return res.send(404);
    }
    return res.json(producto);
  });
};

// Creates a new producto in the DB.
exports.create = function(req, res) {
  Producto.create(req.body, function(err, producto) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(201, producto);
  });
};

// Updates an existing producto in the DB.
exports.update = function(req, res) {

  Producto.findById(req.body._id, function(err, producto) {
    if (err) {
      return handleError(res, err);
    }
    if (!producto) {
      return res.send(404);
    }
    producto.update(req.body, function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, producto);
    });
  });
};

// Deletes a producto from the DB.
exports.destroy = function(req, res) {
  Producto.findById(req.params.id, function(err, producto) {
    if (err) {
      return handleError(res, err);
    }
    if (!producto) {
      return res.send(404);
    }
    producto.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

//obtiene productos segun query filtros
exports.getProductosByQuery = function(req, res) {
  var filtros = [];
  exports.producto = [];

  //obtiene lista de filtros
  if (req.body && req.body.length !== 0) {
    filtros = req.body;
  }
  console.dir(filtros);

  if (filtros && filtros.length !== 0) {
    exports.producto = Producto.find({
      'filtros._id': {
        $in: filtros //busca segun filtros
      },
      active: true //retorna solo productos activos

    }, function(err, productos) {
      //si ocurre un error en el servidor
      if (err) {
        return handleError(res, err);
      }

      //si no existen errores, envia lista de productos
      return res.json(200, productos);
    });
  } else {
    return res.json(200, []);
  }
};


exports.getProductosByAtributos = function(req, res) {
  var atributos = [];

  //obtiene lista de filtros
  if (req.body && req.body.length !== 0) {
    atributos = req.body;
  }
  //console.dir(atributos);
  if (atributos && atributos.length !== 0) {
    exports.producto.find({
      'atributos.especificacion': {
        $all: atributos
      },
      active: true //retorna solo productos activos

    }, function(err, productos) {
      //si ocurre un error en el servidor
      if (err) {
        return handleError(res, err);
      }

      //si no existen errores, envia lista de productos
      return res.json(200, productos);
    });
  } else {
    return res.json(200, []);
  }
};

exports.getProductosRelacionados = function(req, res) {

  //busca producto especifico
  Producto.findById(req.params.id, function(err, producto) {

    if (err) {
      return handleError(res, err);
    }
    if (!producto) {
      return res.send(404);
    }
    //busca filtros asociados a producto
    if (producto.productos_rel && producto.productos_rel.length !== 0) {
      Producto.find({
        '_id': {
          $in: producto.productos_rel //busca para todos los id de filtro
        }
      }, function(err, data) {
        if (err) {
          return handleError(res, err);
        }
        //retorna lista de objetos filtro
        return res.json(data);
      });
    }
    return res.json({});
  });
};

exports.getAtributosProducto = function(req, res) {

  //busca producto especifico
  Producto.findById(req.params.id, function(err, producto) {

    if (err) {
      return handleError(res, err);
    }
    if (!producto) {
      return res.send(404);
    }

    //busca filtros asociados a producto
    if (producto.atributos && producto.atributos.length !== 0) {
      Atributo.find({
        '_id': {
          $in: producto.atributos //busca para todos los id de filtro
        }
      }, function(err, atributos) {

        if (err) {
          return handleError(res, err);
        }

        //retorna lista de objetos filtro
        return res.json(atributos);
      });
    }
  });
};

exports.getProductosBySeccion = function(req, res) {
  //obtiene obj seccion .. datos query y maximos
  var seccion = req.body;
  //console.dir(seccion);
  //verifica datos para hacer consulta
  if (seccion && seccion.maximo_item && seccion.maximo_item !== 0 && seccion.query && seccion.query.length !== 0) {
    Producto
      .find({
        'filtros._id': {
          $in: seccion.query //busca segun filtros de seccion
        },
        active: true //retorna solo productos activos
      })
      .limit(seccion.maximo_item) //agrega limite de registros que retorna
      .exec(function(err, productos) {
        //controla error en consulta
        if (err) {
          return handleError(res, req);
        }
        //retorna productos obtenidos para la seccion
        return res.json(200, productos);
      });
  } else {
    //si no estan los datos para hacer la query .. retorna vacio, sin error
    return res.json(200, []);
  }
};

exports.getProductosBusqueda = function(req, res) {
  var tags_normalize = [];
  _.forEach(req.body.tags, function(tag) {
    console.dir(tag);
    tags_normalize.push(tag);
    tag = tag.toLowerCase();
    tag = tag.replace(new RegExp(/a/g), '(a|á)');
    tag = tag.replace(new RegExp(/e/g), '(e|é)');
    tag = tag.replace(new RegExp(/i/g), '(i|í)');
    tag = tag.replace(new RegExp(/o/g), '(o|ó)');
    tag = tag.replace(new RegExp(/u/g), '(u|ú)');
    tag = tag.replace(new RegExp(/á/g), '(a|á)');
    tag = tag.replace(new RegExp(/é/g), '(e|é)');
    tag = tag.replace(new RegExp(/í/g), '(i|í)');
    tag = tag.replace(new RegExp(/ó/g), '(o|ó)');
    tag = tag.replace(new RegExp(/ú/g), '(u|ú)');
    //tag = tag.replace(new RegExp(/[ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñ]/g),'.');
    console.dir(tag);
    tags_normalize.push(tag);
  });
  console.dir(tags_normalize);
  var tags = tags_normalize.join('|');
  var string_tags = '(' + tags + ')';
  console.dir(string_tags);

  Producto.find({
      $or: [{
        'tag': {
          $in: tags_normalize
        }
      }, {
        'nombre': new RegExp(string_tags, 'i')
      }, {
        'descripcion': new RegExp(string_tags, 'i')
      }]
    },
    function(err, productos) {
      if (err) {
        return handleError(res, req);
      }
      if (!productos) {
        return res.send(404);
      }
      return res.json(200, productos);
    });
};

exports.getProductosBusquedaFiltros = function(req, res) {

  //verifica formato entrada
  if (req.body.busqueda) {
    var filtro_id = req.body.busqueda.filtro_id ? req.body.busqueda.filtro_id : {
      $exists: true
    };
    var query_tags = {
      'tag': {
        $exists: true
      }
    };
    var query_words = {
      $exists: true
    };
    var codigo = null;
    if (req.body.busqueda.palabras && req.body.busqueda.palabras.length === 1 && !isNaN(req.body.busqueda.palabras[0])) {
      codigo = req.body.busqueda.palabras[0];
    }

    if (req.body.busqueda.palabras && req.body.busqueda.palabras.length > 0) {
      query_words = '';
      query_tags = [];

      _.forEach(req.body.busqueda.palabras, function(tag) {

        var tag_1 = tag;
        tag = tag.toLowerCase();
        tag = tag.replace(new RegExp(/a/g), '(a|á)');
        tag = tag.replace(new RegExp(/e/g), '(e|é)');
        tag = tag.replace(new RegExp(/i/g), '(i|í)');
        tag = tag.replace(new RegExp(/o/g), '(o|ó)');
        tag = tag.replace(new RegExp(/u/g), '(u|ú)');
        tag = tag.replace(new RegExp(/á/g), '(a|á)');
        tag = tag.replace(new RegExp(/é/g), '(e|é)');
        tag = tag.replace(new RegExp(/í/g), '(i|í)');
        tag = tag.replace(new RegExp(/ó/g), '(o|ó)');
        tag = tag.replace(new RegExp(/ú/g), '(u|ú)');
        var tag_2 = tag;

        if (tag_1 === tag_2) {

          query_tags.push({
            'tag': tag_1
          });
          query_words = query_words + '(?=.*' + tag_1 + '.*)';

        } else {

          query_tags.push({
            $or: [{
              'tag': tag_1
            }, {
              'tag': tag_2
            }]
          });
          query_words = query_words + '(?=((.*' + tag_1 + '.*)|(.*' + tag_2 + '.*)))';
        }
      });

      query_tags = {
        $and: query_tags
      };
      query_words = new RegExp('(' + query_words + ')', 'i');

    }

    var params = {
      $and: [{
        $or: [query_tags, {
          'nombre': query_words
        }, {
          'descripcion': query_words
        }, {
          'stock.codigo': codigo
        }]
      }, {
        'filtros._id': filtro_id
      }]
    };

    console.log('Parametros busqueda');
    console.log(util.inspect(params, false, null));

    Producto.find(params, function(err, productos) {
      console.log('Busqueda .. ok');
      if (err) {
        console.log('Busqueda .. error');
        console.log(util.inspect(err, false, null));
        return handleError(res, err);
      }
      if (productos || productos.length > 0) {
        console.log('Busqueda .. productos = ' + productos.length);
        return res.json(200, productos);
      } else {
        console.log('Busqueda .. sin productos');
        return res.json(200, []);
      }
    });
  } else {
    return res.json(200, []);
  }

  /*
  var filtro_id = req.body.busqueda.filtro_id;
  var tags_normalize = [];
  _.forEach(req.body.busqueda.palabras, function(tag) {
    console.dir(tag);
    tags_normalize.push(tag);
    tag = tag.toLowerCase();
    tag = tag.replace(new RegExp(/a/g), '(a|á)');
    tag = tag.replace(new RegExp(/e/g), '(e|é)');
    tag = tag.replace(new RegExp(/i/g), '(i|í)');
    tag = tag.replace(new RegExp(/o/g), '(o|ó)');
    tag = tag.replace(new RegExp(/u/g), '(u|ú)');
    tag = tag.replace(new RegExp(/á/g), '(a|á)');
    tag = tag.replace(new RegExp(/é/g), '(e|é)');
    tag = tag.replace(new RegExp(/í/g), '(i|í)');
    tag = tag.replace(new RegExp(/ó/g), '(o|ó)');
    tag = tag.replace(new RegExp(/ú/g), '(u|ú)');
    //tag = tag.replace(new RegExp(/[ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñ]/g),'.');
    console.dir(tag);
    tags_normalize.push(tag);
  });
  console.dir(tags_normalize);
  var tags = tags_normalize.join('|');
  var string_tags = '(' + tags + ')';
  console.dir(string_tags);
  if (filtro_id) {
    Producto.find({
        $and: [{
          $or: [{
            'tag': {
              $in: tags_normalize
            }
          }, {
            'nombre': new RegExp(string_tags, 'i')
          }, {
            'descripcion': new RegExp(string_tags, 'i')
          }]
        }, {
          'filtros._id': filtro_id
        }]
      },
      function(err, productos) {
        if (err) {
          return handleError(res, req);
        }
        if (!productos) {
          return res.send(404);
        }
        return res.json(200, productos);
      });
  } else {
    Producto.find({
        $or: [{
          'tag': {
            $in: tags_normalize
          }
        }, {
          'nombre': new RegExp(string_tags, 'i')
        }, {
          'descripcion': new RegExp(string_tags, 'i')
        }]
      },
      function(err, productos) {
        if (err) {
          return handleError(res, req);
        }
        if (!productos) {
          return res.send(404);
        }
        return res.json(200, productos);
      });
  }
  */
};

exports.getRangoPrecios = function(req, res) {
  var precios = [];
  Producto.findOne().where({
    active: true
  }).sort('precio').exec(function(err, doc) {
    if (err) {
      return handleError(res, req);
    }
    if (!doc) {
      return res.send(404);
    }

    precios.push(doc.precio);

    Producto.findOne().where({
      active: true
    }).sort('-precio').exec(function(err, doc) {
      if (err) {
        return handleError(res, req);
      }
      if (!doc) {
        return res.send(404);
      }

      precios.push(doc.precio);

      return res.json(200, precios);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
