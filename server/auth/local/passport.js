var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function (User, config) {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password' // this is the virtual field on the model
    },
    function(email, password, done) {
      User.findOne({
        email: email.toLowerCase()
      }, function(err, user) {
         if (err) return done(err);
        if (!user) {
          return done(null, false, {internal_code: 2, message: 'El correo ingresado no existe.' });
        }
        if (!user || !user.authenticate(password)) {
          //se agrego propiedad internal_code para diferenciar entre errores conocidos y desconocidos
          return done(null, false, { internal_code: 1, message: 'Contraseña incorrecta.' });
        }
        return done(null, user);
      });
    }
  ));
};