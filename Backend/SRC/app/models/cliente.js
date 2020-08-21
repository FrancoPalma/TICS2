const mongoose = require('mongoose');
const { Schema } = mongoose;

const cliente = new mongoose.Schema({
  rut: {type: String},
  nombre: {type: String},
  telefono: {type: String},
  { collection : 'cliente'}
);

module.exports = mongoose.model('Cliente', cliente);
