/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Seccion = require('./seccion.model');

exports.register = function(socket) {
  Seccion.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Seccion.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('seccion:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('seccion:remove', doc);
}