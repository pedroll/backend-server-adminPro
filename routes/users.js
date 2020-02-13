const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');

/* GET users listing. */
// obtener usuarios
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

// crear usuario
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
    password: bcrypt.hashSync(body.password, 8),
    image: body.image,
    role: body.role
  });
  usuario.save((err, usuarioGuardado) => {
    if (err) {
      return res.status(400)
        .json({
          ok: false,
          mensaje: 'Error guardando usuario',
          errors: err
        });
    }

    usuarioGuardado.password = ';)';
    res.status(201)
      .json({
        ok: true,
        mensaje: 'usuario anadido',
        usuario: usuarioGuardado
      });

  });

});

// actualizar usuario
router.put('/:id', (req, res) => {

  const id = req.params.id;
  const body = req.body;

  // buscamos usuario en bdd
  Usuario.findById(id, (err, usuarioEncontrado) => {

    // errores
    if (err) {
      return res.status(500)
        .json({
          ok: false,
          mensaje: 'Error  al buscar usuario',
          errors: err
        });
    }
    if (!usuarioEncontrado) {
      return res.status(400)
        .json({
          ok: false,
          mensaje: `Error  usuario ${id} no encontrado`,
          errors: err
        });
    }

    usuarioEncontrado.nombre = body.nombre;
    usuarioEncontrado.email = body.email;
    // usuarioEncontrado.password= bcrypt.hashSync(body.password, 8);
    // usuarioEncontrado.image= body.image;
    usuarioEncontrado.role = body.role;

    usuarioEncontrado.save((err, usuarioGuardado) => {

      if (err) {
        return res.status(400)
          .json({
            ok: false,
            mensaje: 'Error actualizando usuario',
            errors: err
          });
      }

      usuarioGuardado.password = ';)';
      res.status(200)
        .json({
          ok: true,
          mensaje: 'usuario actualizado',
          usuario: usuarioGuardado
        });

    });

  });


});


module.exports = router;
