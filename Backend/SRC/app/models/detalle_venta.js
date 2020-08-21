const mongoose = require('mongoose');
const {Schema} = mongoose

var detalle_venta = new Schema   ({
        numero_venta: {type: String, require: true},
        cod_prod: {type: String, require: true}},
        {collection: 'detalle_venta'}
      );

module.exports = mongoose.model('Detalle_venta', detalle_venta);
