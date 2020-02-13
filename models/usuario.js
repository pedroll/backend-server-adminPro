const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// VALIDACION SEMIAUTOMATICA UNIQUE Y ENUM
//todo: validar en formulario
const uniqueValidator = require('mongoose-unique-validator');
const rolesValidos = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} NO ES UN ROL VALIDO'
};

const usuarioSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El usuario es requerido']
    },
    email: {
      type: String,
      required: [true, 'El usuario es requerido'],
      unique: true
    },
    password: {
      type: String,
      required: [true, 'El usuario es requerido']
    },
    image: {
      type: String,
      required: false
    },
    role: {
      type: String,
      required: [true, 'El usuario es requerido'],
      default: 'USER_ROLE',
      enum: rolesValidos
    }
  }
);
usuarioSchema.plugin(uniqueValidator, {
  message: 'el {PATH} debe ser unico',
});

module.exports = mongoose.model('Usuario', usuarioSchema);
