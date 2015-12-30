'use strict';
var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var Tienda = require('../tienda/tienda.model');
var Servicio = require('../servicio/servicio.controller');
var http = require('http');
var validationError = function(res, err) {
    return res.json(422, err);
};
/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
    User.find({}, '-salt -hashedPassword', function(err, users) {
        if (err) return res.send(500, err);
        res.json(200, users);
    });
};
/**
 * Creates a new user
 */
exports.create = function(req, res, next) {
    var newUser = new User(req.body);
    var password = req.body.password;
    console.log('password: ' + password);
    newUser.provider = 'local';
    newUser.role = req.body.role;
    newUser.save(function(err, user) {
        if (err) {
            return validationError(res, err);
        }
        Tienda.find(function(err, tiendas) {
            if (tiendas && tiendas.length > 0 && tiendas[0] && tiendas[0]._id) {
                var usuario = {
                    tipo_usuario: user.role,
                    _id: user._id ? user._id : '',
                    name: user.name ? user.name : '',
                    email: user.email ? user.email : '',
                    razon: user.razon ? user.razon : '',
                    id_tienda: tiendas[0]._id,
                    password: password
                };
                console.dir(usuario);
                var registrar_encrypt = Servicio.encriptar(JSON.stringify(usuario));
                var data_in = { u: registrar_encrypt };

                //opciones post
                var url_tienda = (tiendas[0].url_checkout.substring(0, tiendas[0].url_checkout.length - 1)).split('//')[1];
                var options = {
                    hostname: url_tienda,    
                    port: 80,                
                    path: '/ServicioTienda/RegistroUsuario',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': JSON.stringify(data_in).length
                    }
                };

                //request
                var req = http.request(options, function(http_res) {
                    http_res.setEncoding('utf8');
                    var data = '';
                    http_res.on('data', function(chunk) {
                        data += chunk;
                    });
                    http_res.on('end', function() {
                        console.dir(data);
                        if (JSON.parse(data).status === 'JSON_CODE_STATUS_OK') {
                            var token = jwt.sign({
                                _id: user._id
                            }, config.secrets.session, {
                                expiresInMinutes: 60 * 5
                            });
                            res.json({
                                token: token
                            });
                        } else {
                            console.log('problem with response: ERROR SERVER');
                            console.dir(arguments);
                            User.findByIdAndRemove(user._id, function(err, userRemove) {
                                if (err) return res.send(500, err);
                                if (JSON.parse(data).status === 'JSON_CODE_STATUS_ERROR') return res.send(500, data);
                                else return res.send(500);
                                
                            });
                        }
                    });
                    http_res.on('error', function() {
                        console.log('problem with response: ');
                        console.dir(arguments);
                        User.findByIdAndRemove(user._id, function(err, userRemove) {
                            console.log('userRemove');
                            console.dir(userRemove);
                            if (err) return res.send(500, err);
                            return res.send(500);
                        });
                    });
                });
                req.on('error', function(e) {
                    console.log('problem with request');
                    console.dir(arguments);
                    User.findByIdAndRemove(user._id, function(err, userRemove) {
                        if (err) return res.send(500, err);
                        return res.send(500);
                    });
                });
                req.write(JSON.stringify(data_in));
                req.end();
            } else {
                User.findByIdAndRemove(user._id, function(err, userRemove) {
                    if (err) return res.send(500, err);
                    return res.send(204);
                });
            }
        });
    });
};

exports.findUserByEmail = function(req, res, next){
    console.dir(req.body);
    var email = req.body.email;   
    console.dir(email);
    User.findOne({'email': email}, function(err, user) {        
        if (err || !user) return res.send(500);
        res.send(200);        
    });
};

exports.changePasswordByEmail = function(req, res, next){
    console.dir(req.body);
    var email = req.body.email;
    var newPass = req.body.password;    
    User.findOne({'email': email}, function(err, user) {        
        user.password = newPass;
        user.save(function(err) {
            if (err) return validationError(res, err);
            res.send(200);
        });        
    });
};
/**
 * Get a single user
 */
exports.show = function(req, res, next) {
    var userId = req.params.id;
    User.findById(userId, function(err, user) {
        if (err) return next(err);
        if (!user) return res.send(401);
        res.json(user.profile);
    });
};
/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
    User.findByIdAndRemove(req.params.id, function(err, user) {
        if (err) return res.send(500, err);
        return res.send(204);
    });
};
/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
    var userId = req.user._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);
    User.findById(userId, function(err, user) {
        if (user.authenticate(oldPass)) {
            user.password = newPass;
            user.save(function(err) {
                if (err) return validationError(res, err);
                res.send(200);
            });
        } else {
            res.send(403);
        }
    });
};
exports.editUser = function(req, res, err) {
    User.findById(req.body._id, function(err, user) {
        if (err) return validationError(res, err);
        if (!user) return res.send(404);
        //valida email no repetido
        User.findOne({
            email: req.body.email
        }, function(err, vUser) {
            if (err) return validationError(res, err);
            if (vUser && (vUser._id.equals(user._id))) {
                user.update(req.body, function(err) {
                    if (err) return validationError(res, err);
                    return res.json(200, user);
                });
            } else {
                return validationError(res, {
                    error_correo_ocupado: 'Email ya esta ocupado por otro usuario'
                });
            }
        });
    });
};
exports.addCarro = function(req, res, err) {
    var userId = req.body.user._id;
    User.findById(userId, function(err, user) {
        user.carrito = {};
        user.carrito = req.body.carrito;
        user.save(function(err) {
            if (err) return err;
            res.send(200);
        });
    });
};
/**
 * Get my info
 */
exports.me = function(req, res, next) {
    var userId = req.user._id;
    User.findOne({
        _id: userId
    }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
        if (err) return next(err);
        if (!user) return res.json(401);
        res.json(user);
    });
};
/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
    res.redirect('/');
};