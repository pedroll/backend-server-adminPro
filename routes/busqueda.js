const express = require('express');
const router = express.Router();
const Hospital = require('../models/hospital');
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');


router.get('/coleccion/:tabla/:busqueda', (req, res) => {

  const tabla = req.params.tabla;
  const busqueda = req.params.busqueda;
  // creamos regexp para busquedas insensibles
  const regexp = new RegExp(busqueda, 'i');
  let promesa;

  switch (tabla) {
    case 'usuario':
      promesa = buscarUsuarios(busqueda, regexp);
      break;
    case 'hospital':
      promesa = buscarHospitalees(busqueda, regexp);
      break;
    case 'medico':
      promesa = buscarMedicos(busqueda, regexp);
      break;
    default:
      return res.status(400)
        .json({
          ok: false,
          //total: total,
          mensaje: `error al buscar en${tabla} las tablas validas son usuario, hospital, medico`,
          error: { mensaje: `error al buscar en${tabla} las tablas validas son usuario, hospital, medico` }
        });
  }
  promesa.then((data) => {
    console.log(promesa);
    res.status(200)
      .json({
        ok: true,
        //total: total,
        [tabla]: data
      });
  });


});


// obtener hospitals
// eslint-disable-next-line no-unused-vars
router.get('/todo/:busqueda', (req, res, next) => {

  const busqueda = req.params.busqueda;
  // creamos regexp para busquedas insensibles
  const regexp = new RegExp(busqueda, 'i');
  // offset paginacion
  // let desde = req.query.desde || 0;
  // desde = Number(desde);

  // se resuelbe cuando todas las promesas retornan
  Promise.all([
    buscarHospitalees(busqueda, regexp),
    buscarMedicos(busqueda, regexp),
    buscarUsuarios(busqueda, regexp)
  ])
    .then(
      (respuestas) => {
        res.status(200)
          .json({
            ok: true,
            //total: total,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
          });
      }
    );
});

function buscarHospitalees(busqueda, regexp) {

  return new Promise(
    (resolve, reject) => {
<<<<<<< HEAD
      Hospital.find({ nombre: regexp })
        .populate('usuario', 'nombre email')
        .populate('medico', 'nombre usuario')
        .exec((err, hospitales) => {
=======
      Hospital.find(
        { nombre: regexp },
        (err, hospitales) => {
>>>>>>> origin/master
          if (err) {
            reject('Error cargando hospital', err);
          } else {
            resolve(hospitales);
          }
        });
    }
  );

}

function buscarMedicos(busqueda, regexp) {

  return new Promise(
    (resolve, reject) => {
      Medico.find(
        { nombre: regexp },
        (err, medicos) => {
          if (err) {
            reject('Error cargando medicos', err);
          } else {
            resolve(medicos);
          }
        })
        .populate('usuario', 'nombre email')
        .populate('hospital', 'nombre usuario');
    }
  );

}

function buscarUsuarios(busqueda, regexp) {

  return new Promise(
    (resolve, reject) => {
      Usuario.find(
        (err, usuarios) => {
          if (err) {
            reject('Error cargando usuarios', err);
          } else {
            resolve(usuarios);
          }
        })
        // conjunto de condiciones or
        .or([{ nombre: regexp }, { email: regexp }])
      ;
    }
  );

}

module.exports = router;
