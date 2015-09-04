/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Filtro = require('./filtro.model');

exports.register = function(socket) {
  Filtro.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Filtro.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('filtro:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('filtro:remove', doc);
}