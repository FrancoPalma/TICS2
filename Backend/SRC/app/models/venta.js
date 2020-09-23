const mongoose = require('mongoose');
const {Schema} = mongoose

var venta = new Schema   ({
      numero_venta: {type: Number, require: true},
      fecha: {type: Date, require: true},
      metodo_pago: {type: String, require: true},
      descuento: {type: Number, require: true},
      total: {type: Number, require: true},
      vendedor: {type: String, require: true},
      sucursal: {type: String, require: true},
      //cantidad: {type: Number, require: true},
      productos: [{
        codigo: {type: String, require: true},
        tipo: {type: String, require: true},
        material: {type: String, require: true},
        piedra: {type: String, require: true},
        precio: {type: Number, require: true},
        descripcion:{type:String,require:true},
        sucursal: {type: String, require: true}
      }]
    },
      {collection: 'venta'}
    );
module.exports = mongoose.model('Venta', venta);
