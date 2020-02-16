const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const hospitalSchema = new Schema({
    nombre: {
      type: String,
      required: [true, 'El	nombre	es	necesario']
    },
    img: {
      type: String,
      required: false
    },
    usuario: {
      // este tipo indica la referencia al id de otra coleccion
      type: Schema.Types.ObjectId,
      ref: 'Usuario'
    }
  },
  // forzamos el nombre de la coleccion para que no cree el plural en ingles hospitals
  { collection: 'hospitales' });

module.exports = mongoose.model('Hospital', hospitalSchema);
