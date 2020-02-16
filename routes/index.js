const express = require('express');
const router = express.Router();

// next utilizado para middlewares
// eslint-disable-next-line no-unused-vars
router.get('/', (req, res, next) => {
  res.status(200)
    .json(
      {
        ok: true,
        mensaje: 'peticion realizada correctamente'
      }
    );
});

module.exports = router;
