const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const {Schema} = mongoose;

const usuario = new mongoose.Schema({
  rut: {type: String},
  password: {type: String},
  nombre: {type: String},
  telefono: {type: String},
  privilegios: {
    gestion_empledo: {type: Boolean, require: true},
    gestion_inventario: {type: Boolean, require: true},
    gestion_privilegios: {type: Boolean, require: true},
    descuento_permitido: {type: Number, require: true}
  },
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
