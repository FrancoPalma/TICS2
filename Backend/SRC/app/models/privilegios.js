const mongoose = require('mongoose');
const {Schema} = mongoose

var producto = new Schema   ({
        gestion_empledo: {type: Boolean, require: true},
        gestion_inventario: {type: Boolean, require: true},
        gestion_privilegios: {type: Boolean, require: true},
        descuento_permitido: {type: Number, require: true}
        {collection: 'privilegios'}
      );

module.exports = mongoose.model('Privilegios', privilegios);
