/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Servicio = require('./servicio.model');

exports.register = function(socket) {
  Servicio.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Servicio.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('servicio:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('servicio:remove', doc);
}