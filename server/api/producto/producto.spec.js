'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /api/productos', function() {

  it('deberia responder un array JSON con los productos', function(done) {
    request(app)
      .get('/api/producto')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});
