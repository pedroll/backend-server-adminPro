const jwt = require('jsonwebtoken');
const { SEED } = require('../config/config');

// Middleware verificar token
// a partir de aqui utilizaran el middleware
const verificaToken = function (req, res, next) {

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

    // extraemos el usuario del token
    req.usuario = decoded.usuario;
    // con el next continua despues de pasar sin error
    next();

  });

};


module.exports = verificaToken;
