/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Variante = require('./variante.model');

exports.register = function(socket) {
  Variante.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Variante.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('variante:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('variante:remove', doc);
}