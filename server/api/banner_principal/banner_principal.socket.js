/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var BannerPrincipal = require('./banner_principal.model');

exports.register = function(socket) {
  BannerPrincipal.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  BannerPrincipal.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('banner_principal:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('banner_principal:remove', doc);
}