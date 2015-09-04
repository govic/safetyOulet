/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Atributo = require('./atributo.model');

exports.register = function(socket) {
  Atributo.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Atributo.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('atributo:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('atributo:remove', doc);
}