const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const medicoSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El	nombre	es	necesario']
  },
  image: {
    type: String,
    required: false
  },
  usuario: {
    // este tipo indica la referencia al id de otra coleccion
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  hospital: {
    // este tipo indica la referencia al id de otra coleccion
    type: Schema.Types.ObjectId,
    ref: 'Hospital',
    required: [true, 'El	id	hospital	es un	campo	obligatorio']
  }
});
module.exports = mongoose.model('Medico', medicoSchema);
