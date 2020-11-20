const mongoose = require('mongoose');
const { Schema } = mongoose;

const pedido = new Schema({
  numero_pedido: {type: Number, required: true},
  fecha: {type: Date, required: true},
  sucursal: {type: String, required: true},
  descripcion: {type: String, required: true},
  cliente_nombre: {type: String, require: true},
  cliente_telefono: {type: String, require: true},
  estado : {type: String, required: true},
  abono: {type: Number, required: true},
  total: {type: Number, required: true}
  },
  {collection: 'pedido'}
)

module.exports = mongoose.model('Pedido', pedido);
