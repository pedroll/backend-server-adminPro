const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SEED } = require('../config/config');
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

// Middleware verificar token
// a partir de aqui utilizaran el middleware
router.use('/', (req, res, next) => {

  const token = req.query.token;
  jwt.verify(token, SEED, (err, decoded) => {

    if (err) {
      return res.status(401)
        .json({
          ok: false,
          mensaje: 'Token incorrecto',
          errors: err
        });
    }
    next();

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
          mensaje: `Error  usuario ${id} no encontrado`
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

// borrar usuario
router.delete('/:id', (req, res) => {

  const id = req.params.id;
  //const body = req.body;

  // buscamos usuario en bdd
  Usuario.findByIdAndRemove(id, (err, usuarioborrado) => {

    // errores
    if (err) {
      return res.status(500)
        .json({
          ok: false,
          mensaje: 'Error   borrando usuario',
          errors: err
        });
    }
    if (!usuarioborrado) {
      return res.status(400)
        .json({
          ok: false,
          mensaje: `Error  usuario ${id} no encontrado`,
          errors: err
        });
    }

    usuarioborrado.password = ';)';
    res.status(200)
      .json({
        ok: true,
        mensaje: 'usuario borrado',
        usuario: usuarioborrado
      });

  });


});


module.exports = router;
