const mongoose = require('mongoose');
const {Schema} = mongoose;
let ObjectId = Schema.ObjectId;

var lista = new Schema   ({
        codigo: {type: String, require: true},
        tipo: {type: String, require: true},
        material: {type: String, require: true},
        piedra: {type: String, require: true},
        cantidad: {type: String, require: true},
        precio: {type: Number, require: true}},
        {collection: 'lista'}
      );

module.exports = mongoose.model('Lista', lista);
