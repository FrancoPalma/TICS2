const mongoose = require('mongoose');
const {Schema} = mongoose

var sucursal = new Schema   ({
        nombre: {type: String, require: true},
        direccion: {type: String, require: true},
        id_jefe: {type: String, require: true},
        {collection: 'sucursal'}
      );

module.exports = mongoose.model('Sucursal', sucursal);
