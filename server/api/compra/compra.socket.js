/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Compra = require('./compra.model');

exports.register = function(socket) {
  Compra.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Compra.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('compra:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('compra:remove', doc);
}