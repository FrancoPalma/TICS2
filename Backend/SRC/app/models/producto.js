const mongoose = require('mongoose');
const {Schema} = mongoose;

var producto = new Schema   ({
        codigo: {type: String, require: true},
        tipo: {type: String, require: true},
        material: {type: String, require: true},
        piedra: {type: String, require: true},
        precio: {type: Number, require: true},
        descripcion:{type:String,require:true},
        sucursal: {type: String, require: true},
        cantidad: {type: Number, require:true}},
        {collection: 'producto'}
      );

module.exports = mongoose.model('Producto', producto);
