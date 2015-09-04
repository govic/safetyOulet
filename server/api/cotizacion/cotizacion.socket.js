/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Cotizacion = require('./cotizacion.model');

exports.register = function(socket) {
  Cotizacion.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Cotizacion.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('cotizacion:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('cotizacion:remove', doc);
}