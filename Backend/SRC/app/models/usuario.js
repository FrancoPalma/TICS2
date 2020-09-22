
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const usuario = new mongoose.Schema({
  rut: {type: String},
  password: {type: String},
  nombre: {type: String},
  telefono: {type: String},
  rol: {type: String},
  sucursal: {type: String}},
  { collection : 'usuario'}
);

// generating a hash
usuario.methods.generateHash = function (password) {
return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
usuario.methods.validPassword = function (password) {
return bcrypt.compareSync(password, this.password);
};

// create the model for user and expose it to our app
module.exports = mongoose.model('Usuario', usuario);
