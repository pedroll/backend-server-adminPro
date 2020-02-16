const express = require('express');
const router = express.Router();
const Medico = require('../models/medico');

// importamos el middleware para utilizarlo en las rutas que queremos
const verificaToken = require('../middleware/autenticacion');

// obtener medicos
// eslint-disable-next-line no-unused-vars
router.get('/', (req, res, next) => {

  Medico.find(
    {},
    (err, medicos) => {
      if (err) {
        return res.status(500)
          .json({
            ok: false,
            mensaje: 'Error cargando medico',
            errors: err
          });
      }

      res.status(200)
        .json({
          ok: true,
          medicos: medicos
        });
    });
});


// crear medico
// ponemos el middleware entre el path y el callback der post
router.post('/', verificaToken, (req, res) => {

  const body = req.body;
  const medico = new Medico({
    nombre: body.nombre,
    img: body.image,
    hospital: body.hospitalId,
    usuario: body.usuarioId
  });
  medico.save((err, medicoGuardado) => {
    if (err) {
      return res.status(400)
        .json({
          ok: false,
          mensaje: 'Error guardando medico',
          errors: err
        });
    }

    res.status(201)
      .json({
        ok: true,
        mensaje: 'medico anadido',
        medico: medicoGuardado,
        usuarioToken: req.usuario,
        body: body
      });

  });

});

// actualizar medico
router.put('/:id', verificaToken, (req, res) => {

  const id = req.params.id;
  const body = req.body;

  // buscamos medico en bdd
  Medico.findById(id, (err, medicoEncontrado) => {

    // errores
    if (err) {
      return res.status(500)
        .json({
          ok: false,
          mensaje: 'Error  al buscar medico',
          errors: err
        });
    }
    if (!medicoEncontrado) {
      return res.status(400)
        .json({
          ok: false,
          mensaje: `Error  medico ${id} no encontrado`
        });
    }

    medicoEncontrado.nombre = body.nombre;
    medicoEncontrado.img = body.image;
    medicoEncontrado.hospital = body.hospitalId;
    medicoEncontrado.usuario = body.usuarioId;

    medicoEncontrado.save((err, medicoGuardado) => {

      if (err) {
        return res.status(400)
          .json({
            ok: false,
            mensaje: 'Error actualizando medico',
            errors: err
          });
      }

      // medicoGuardado.password = ';)';
      res.status(200)
        .json({
          ok: true,
          mensaje: 'hospital actualizado',
          medicoGuardado: medicoGuardado
        });

    });

  });


});

// borrar medico
router.delete('/:id', verificaToken, (req, res) => {

  const id = req.params.id;

  // buscamos medico en bdd
  Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

    // errores
    if (err) {
      return res.status(500)
        .json({
          ok: false,
          mensaje: 'Error   borrando medico',
          errors: err
        });
    }
    if (!medicoBorrado) {
      return res.status(400)
        .json({
          ok: false,
          mensaje: `Error  medico ${id} no encontrado`,
          errors: err
        });
    }

    res.status(200)
      .json({
        ok: true,
        mensaje: 'medico borrado',
        medicoBorrado: medicoBorrado
      });

  });


});


module.exports = router;
