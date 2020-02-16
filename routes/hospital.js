const express = require('express');
const router = express.Router();
const Hospital = require('../models/hospital');

// importamos el middleware para utilizarlo en las rutas que queremos
const verificaToken = require('../middleware/autenticacion');

// obtener hospitals
// eslint-disable-next-line no-unused-vars
router.get('/', (req, res, next) => {

  // offset paginacion
  let desde = req.query.desde || 0;
  desde = Number(desde);

  Hospital.find(
    {},
    (err, hospitales) => {
      if (err) {
        return res.status(500)
          .json({
            ok: false,
            mensaje: 'Error cargando hospital',
            errors: err
          });
      }

      Hospital.count({}, (err, conteo) => {

        const total = conteo;

        res.status(200)
          .json({
            ok: true,
            total: total,
            hospitales: hospitales
          });

      });


    })
    // en lugar de mostrar campo usuario: usuarioId mostramos la fila usuariom pero solo columnas
    .populate('usuario', 'nombre email')
    // paginacion
    .limit(5)
    // offset paginacion
    .skip(desde);

});


// crear hospital
// ponemos el middleware entre el path y el callback der post
router.post('/', verificaToken, (req, res) => {

  const body = req.body;
  const hospital = new Hospital({
    nombre: body.nombre,
    img: body.image,
    usuario: req.usuario._id
  });
  hospital.save((err, hospitalGuardado) => {
    if (err) {
      return res.status(400)
        .json({
          ok: false,
          mensaje: 'Error guardando hospital',
          errors: err
        });
    }

    res.status(201)
      .json({
        ok: true,
        mensaje: 'hospital anadido',
        hospital: hospitalGuardado,
        usuarioToken: req.usuario,
        body: body
      });

  });

});

// actualizar usuario
router.put('/:id', verificaToken, (req, res) => {

  const id = req.params.id;
  const body = req.body;

  // buscamos usuario en bdd
  Hospital.findById(id, (err, hospitalEncontrado) => {

    // errores
    if (err) {
      return res.status(500)
        .json({
          ok: false,
          mensaje: 'Error  al buscar hospital',
          errors: err
        });
    }
    if (!hospitalEncontrado) {
      return res.status(400)
        .json({
          ok: false,
          mensaje: `Error  hospital ${id} no encontrado`
        });
    }

    hospitalEncontrado.nombre = body.nombre;
    hospitalEncontrado.image = body.image;
    hospitalEncontrado.usuario = req.usuario._id;

    hospitalEncontrado.save((err, hospitalGuardado) => {

      if (err) {
        return res.status(400)
          .json({
            ok: false,
            mensaje: 'Error actualizando hospital',
            errors: err
          });
      }

      // hospitalGuardado.password = ';)';
      res.status(200)
        .json({
          ok: true,
          mensaje: 'hospital actualizado',
          hospital: hospitalGuardado
        });

    });

  });


});

// borrar hospital
router.delete('/:id', verificaToken, (req, res) => {

  const id = req.params.id;

  // buscamos hospital en bdd
  Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

    // errores
    if (err) {
      return res.status(500)
        .json({
          ok: false,
          mensaje: 'Error   borrando hospital',
          errors: err
        });
    }
    if (!hospitalBorrado) {
      return res.status(400)
        .json({
          ok: false,
          mensaje: `Error  hospital ${id} no encontrado`,
          errors: err
        });
    }

    res.status(200)
      .json({
        ok: true,
        mensaje: 'hospital borrado',
        hospitalBorrado: hospitalBorrado
      });

  });


});


module.exports = router;
