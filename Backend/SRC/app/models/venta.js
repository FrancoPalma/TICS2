const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var Producto = mongoose.model('Producto');
var Boleta = mongoose.model('Boleta');

var venta = new Schema   ({
      numero_venta: {type: Number, require: true},
      fecha: {type: Date, require: true},
      sucursal: {type: String, require: true},
      cliente_nombre: {type: String, require: true},
      cliente_telefono: {type: String, require: true},
      productos: [{ type: Schema.ObjectId, ref: "Producto" }]
      },
      {collection: 'venta'}
    );
module.exports = mongoose.model('Venta', venta);
