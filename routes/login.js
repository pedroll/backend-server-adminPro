const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.post('/', (req, res) => {

  const body = req.body;

  Usuario.findOne({ email: body.email }, (err, usuariobd) => {

    if (err) {
      return res.status(500)
        .json({
          ok: false,
          mensaje: 'Error al buscar usuario',
          errors: err
        });
    }

    if (!usuariobd) {
      return res.status(400)
        .json({
          ok: false,
          mensaje: `credenciales incorrectas - email`
        });
    }

    if (!bcrypt.compareSync(body.password, usuariobd.password)) {
      return res.status(400)
        .json({
          ok: false,
          mensaje: `credenciales incorrectas - pass`
        });
    }

    // pasados los posibles errores generamos un token
    usuariobd.password = ';)';
    const token = jwt.sign({ usuario: 'usuariobd' }, 'Çtu-s33d-sup3rs3gur0', { expiresIn: 14400 });


    usuariobd.password = ';)';
    res.status(200)
      .json(
        {
          ok: true,
          mensaje: 'peticion realizada correctamente',
          body: body,
          id: usuariobd._id,
          token: token
        }
      );

  });


});


module.exports = router;
