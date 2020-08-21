const mongoose = require('mongoose');
const { Schema } = mongoose;

const inventario = new Schema({
  id_sucursal: {type: String, required: true}},
  {collection: 'inventario'}
);

module.exports = mongoose.model('Inventario', inventario);
