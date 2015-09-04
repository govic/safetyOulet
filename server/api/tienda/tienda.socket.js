/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Tienda = require('./tienda.model');

exports.register = function(socket) {
  Tienda.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Tienda.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('tienda:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('tienda:remove', doc);
}