const express = require('express');
const router = express.Router();
const fs = require('fs');

const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');

// next utilizado para middlewares
// eslint-disable-next-line no-unused-vars
router.put('/:tipo/:id', (req, res, next) => {

  const tipo = req.params.tipo;
  const id = req.params.id;
  const tiposValido = ['medico', 'hospital', 'usuario'];


  //validar archivo recivido
  if (tiposValido.indexOf(tipo) < 0) {
    return res.status(400)
      .json(
        {
          ok: false,
          mensaje: 'Tipo de coleccion no valido',
          errors: { message: 'Tipo de coleccion no valido' }
        }
      );
  }
  if (!req.files || Object.keys(req.files).length === 0) {
    // return res.status(400)
    //   .send('No files were uploaded.');

    return res.status(400)
      .json(
        {
          ok: false,
          mensaje: 'No File uploaded!'
        }
      );

  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  const imagen = req.files.imagen;
  const nombrecortado = imagen.name.split('.');
  const extension = nombrecortado[nombrecortado.length - 1];

  // solo aceptamos estas extensiones
  const extensionesValidas = ['jpg', 'jpeg', 'png', 'gif'];
  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400)
      .json(
        {
          ok: false,
          mensaje: 'extension no valida',
          error: { message: `las extensiones validas son${extensionesValidas.join(', ')}` }
        }
      );
  }

  // nombre archivo personalizado
  const nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

  //mocver el archivo a un path
  const path = `./uploads/${tipo}/${nombreArchivo}`;
  // Use the mv() method to place the file somewhere on your server
  //let mv =
  imagen.mv(path, (err) => {
    if (err) {
      res.status(500)
        .json(
          {
            ok: false,
            mensaje: 'Error al mover el archivo',
            errors: { message: 'Error al mover el archivo' }
          }
        );
    }

    subirPorTipo(tipo, id, nombreArchivo, res);

  });


});

function subirPorTipo(tipo, id, nombreArchivo, res) {

  switch (tipo) {
    case 'usuario':
      Usuario.findById(id, ((err, usuario) => {

        if (!usuario) {
          return res.status(400)
            .json(
              {
                ok: false,
                mensaje: 'Usuario no existe',
                errors: { message: 'Usuario no existe' }
              }
            );
        }


        const pathViejo = `./uploads/${tipo}/${usuario.image}`;

        // si existe elige imagen anterior
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        if (fs.existsSync(pathViejo)) {
          // eslint-disable-next-line node/prefer-promises/fs,security/detect-non-literal-fs-filename
          fs.unlinkSync(pathViejo);
        }
        //actualizamos bdd con nueva imagen
        usuario.image = nombreArchivo;
        usuario.save((err1, usuarioActualizado) => {
          // if (err1) {
          //
          // }
          usuarioActualizado.password = ':)';
          return res.status(200)
            .json(
              {
                ok: true,
                mensaje: 'Archivo movido correctamente',
                errors: { message: 'Archivo movido correctamente' },
                usuarioActualizado: usuarioActualizado
              }
            );

        });
      }));
      break;
    case 'hospital':
      Hospital.findById(id, ((err, hospital) => {

        if (!hospital) {
          return res.status(400)
            .json(
              {
                ok: false,
                mensaje: 'Hospital no existe',
                errors: { message: 'Hospital no existe' }
              }
            );
        }

        const pathViejo = `./uploads/${tipo}/${hospital.image}`;

        // si existe elige imagen anterior
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        if (fs.existsSync(pathViejo)) {
          // eslint-disable-next-line node/prefer-promises/fs,security/detect-non-literal-fs-filename
          fs.unlinkSync(pathViejo);
        }
        //actualizamos bdd con nueva imagen
        hospital.image = nombreArchivo;
        hospital.save((err1, hospitalActualizado) => {

          return res.status(200)
            .json(
              {
                ok: true,
                mensaje: 'Archivo movido correctamente',
                errors: { message: 'Archivo movido correctamente' },
                hospitalActualizado: hospitalActualizado
              }
            );

        });
      }));
      break;
    case 'medico':
      Medico.findById(id, ((err, medico) => {

        if (!medico) {
          return res.status(400)
            .json(
              {
                ok: false,
                mensaje: 'Medico no existe',
                errors: { message: 'Medico no existe' }
              }
            );
        }

        const pathViejo = `./uploads/${tipo}/${medico.image}`;

        // si existe elige imagen anterior
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        if (fs.existsSync(pathViejo)) {
          // eslint-disable-next-line node/prefer-promises/fs,security/detect-non-literal-fs-filename
          fs.unlinkSync(pathViejo);
        }
        //actualizamos bdd con nueva imagen
        medico.image = nombreArchivo;
        medico.save((err1, medicoActualizado) => {

          return res.status(200)
            .json(
              {
                ok: true,
                mensaje: 'Archivo movido correctamente',
                errors: { message: 'Archivo movido correctamente' },
                medicoActualizado: medicoActualizado
              }
            );

        });
      }));
      break;
  }


}

module.exports = router;
