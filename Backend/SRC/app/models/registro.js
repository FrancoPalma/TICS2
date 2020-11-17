const mongoose = require('mongoose');
const {Schema} = mongoose;

var registro = new Schema   ({
        tipo: {type: String, require: true},
        fecha: {type: String, require: true},
        numero: {type: String, require: true},
        detalle: {type: String, require: true},
        empleadoLog: {type: String, require: true},
        sucursal: {type: String, require: true}
        },
        {collection: 'registro'}
      );

module.exports = mongoose.model('Registro', registro);
