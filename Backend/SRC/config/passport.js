const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const Usuario = require('../app/models/usuario');

  // required for persistent login sessions
  // passport needs ability to serialize and unserialize usuarios out of session
  passport.serializeUser(function (usuario, done) {
    done(null, usuario.id);
  });

  // used to deserialize usuario
  passport.deserializeUser(function (id, done) {
    Usuario.findById(id, function (err, usuario) {
      done(err, usuario);
    });
  });

  // Signup
  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses usuarioname and password, we will override with rut
    usernameField: 'rut',
    passwordField: 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function (req, rut, password, done) {
    Usuario.findOne({'rut': req.body.rut}, function (err, usuario) {
      if (err) {
        return done(err);
      }
      if (usuario) {
        return done(null, false, req.flash('signupMessage', 'the rut is already taken'));
      } else {
        var newUsuario = new Usuario();
        newUsuario.rut = rut;
        newUsuario.nombre = req.body.nombre;
        newUsuario.telefono = req.body.telefono;
        newUsuario.rol = req.body.rol;
        newUsuario.sucursal = req.body.sucursal;
        newUsuario.password = newUsuario.generateHash(password);
        newUsuario.save(function (err) {
          if (err) { throw err; }
          return done(null, newUsuario);
        });
      }
    });
  }));

  // login
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local

  passport.use('local-login', new LocalStrategy({
    usernameField: 'rut',
    passwordField: 'password',
    passReqToCallback: true
  },
  function (req, rut, password, done) {
    Usuario.findOne({'rut': rut}, function (err, usuario) {
      if (err) { return done(err); }
      if (!usuario) {
        return done(null, false, req.flash('loginMessage', 'No User found'))
      }
      if (!usuario.validPassword(password)) {
        return done(null, false, req.flash('loginMessage', 'Wrong. password'));
      }
      return done(null, usuario);
    });
  }));

module.exports = passport;
