const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var venta = new Schema   ({
      numero_venta: {type: Number, require: true},
      fecha: {type: Date, require: true},
      sucursal: {type: String, require: true},
      cliente_nombre: {type: String, require: true},
      cliente_telefono: {type: String, require: true}
      },
      {collection: 'venta'}
    );
module.exports = mongoose.model('Venta', venta);
