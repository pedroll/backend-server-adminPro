const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
/* GET users listing. */
// eslint-disable-next-line no-unused-vars
router.get('/', (req, res, next) => {

  Usuario.find(
    {},
    'nombre email image role',
    (err, usuarios) => {
      if (err) {
        return res.status(500)
          .json({
            ok: false,
            mensaje: 'Error cargando usuario',
            errors: err
          });
      }

      res.status(200)
        .json({
          ok: true,
          usuarios: usuarios
        });
      //res.send('respond with a resource');
    });
});


router.post('/', (req, res) => {
  // utilizamos middleware body-parser
  //  if (err) {
  //    return res.status(500)
  //      .json({
  //        ok: false,
  //        mensaje: 'Error cargando usuario',
  //        errors: err
  //      });
  //  }

  const body = req.body;
  const usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: body.password,
    image: body.image,
    role: body.role
  });
  usuario.save((err, usuario) => {
    if (err) {
      return res.status(400)
        .json({
          ok: false,
          mensaje: 'Error guardando usuario',
          errors: err
        });
    }

    res.status(200)
      .json({
        ok: true,
        mensaje: 'usuario anadido',
        usuario: usuario
      });

  });

});
module.exports = router;
