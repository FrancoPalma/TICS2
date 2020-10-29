const mongoose = require('mongoose');
const {Schema} = mongoose;
const Producto = mongoose.model('Producto');
const Usuario = mongoose.model('Usuario');

var venta = new Schema   ({
      numero_venta: {type: Number, require: true},
      fecha: {type: Date, require: true},
      metodo_pago: {type: String, require: true},
      descuento: {type: Number, require: true},
      total: {type: Number, require: true},
      vendedor: {type: Schema.ObjectId, ref: "getUsuario"},
      sucursal: {type: String, require: true},
      cliente: {type: String, require: true},
      productos: [{
        type: Schema.ObjectId, ref: "Producto"}]
    },
      {collection: 'venta'}
    );
module.exports = mongoose.model('Venta', venta);
