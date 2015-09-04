/**
 * Broadcast updates to client when the model changes
 */
'use strict';

var Producto = require('./producto.model');

exports.register = function(socket) {
  Producto.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Producto.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('producto:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('producto:remove', doc);
}