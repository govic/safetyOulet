/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Despacho = require('./despacho.model');

exports.register = function(socket) {
  Despacho.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Despacho.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('despacho:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('despacho:remove', doc);
}