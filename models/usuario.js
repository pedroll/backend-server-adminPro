const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const usuarioSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El usuario es requerido']
    },
    email: {
      type: String,
      required: [true, 'El usuario es requerido']
    },
    password: {
            type: String,
            required: [true, 'El usuario es requerido']
        },
        img: {
            type: String,
            required: false
        },
        role: {
            type: String,
            required: [true, 'El usuario es requerido'],
            default: "USER_ROLE"
        }
    }
);

module.exports = mongoose.model('Usuario', usuarioSchema);
