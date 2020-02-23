const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// next utilizado para middlewares
// eslint-disable-next-line no-unused-vars
router.get('/:tipo/:img', (req, res, next) => {

  const tipo = req.params.tipo;
  const img = req.params.img;
  const noImage = path.resolve(__dirname, '../uploads/no-img.jpg');
  //obtenemos el path del a imagen
  const pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

  if (fs.existsSync(pathImagen)) {
    res.sendFile(pathImagen);
  } else {
    res.sendFile(noImage);
  }

  // res.status(200)
  //   .json(
  //     {
  //       ok: true,
  //       mensaje: 'peticion realizada correctamenter'+pathImagen
  //     }
  //   );
});

module.exports = router;
