/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Tracking = require('./tracking.model');

exports.register = function(socket) {
  Tracking.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Tracking.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('tracking:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('tracking:remove', doc);
}