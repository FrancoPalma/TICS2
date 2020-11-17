const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var boleta = new Schema({
      fecha: {type: Date, require: true},
      empleadoLog: {type: String, require: true},
      vendedor: {type: String, require: true},
      descuento: {type: Number, require: true},
      total_venta: {type: Number, require: true},
      cliente_nombre: {type: String},
      cliente_telefono: {type: String},
      metodo_pago: {type: String, require: true},
      tipo: {type: String, require: true},
      cod_prod: {type: String},
      valor_prod: {type: Number},
      numero: {type: Number, required: true},
      sucursal: {type: String, require: true}
      },
      {collection: 'boleta'}
    );
module.exports = mongoose.model('Boleta', boleta);
