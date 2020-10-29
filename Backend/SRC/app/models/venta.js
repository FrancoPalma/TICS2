const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var Producto = mongoose.model('Producto');
var Pedido = mongoose.model('Pedido');

var venta = new Schema   ({
      numero_venta: {type: Number, require: true},
      fecha: {type: Date, require: true},
      metodo_pago: {type: String, require: true},
      descuento: {type: Number, require: true},
      total: {type: Number, require: true},
      empleadoLog: {type: String, require: true},
      vendedor: {type: String, require: true},
      sucursal: {type: String, require: true},
      cliente: {type: String, require: true},
      productos: [{ type: Schema.ObjectId, ref: "Producto" }],
      pedido: { type: Schema.ObjectId, ref: "Pedido" }
      },
      {collection: 'venta'}
    );
module.exports = mongoose.model('Venta', venta);
