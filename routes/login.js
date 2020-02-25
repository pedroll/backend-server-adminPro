const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SEED, CLIENT_ID } = require('../config/config');
//// google auth
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

///////////////////////////////////////////////////////
/////// autenticación google              /////////////
///////////////////////////////////////////////////////
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  //const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
  console.log('payload:', payload);
  return {
    email: payload.email,
    nombre: payload.name,
    img: payload.picture,
    google: true
  };
}


router.post('/google', async (req, res) => {

  const body = req.body;
  const token = body.token;

  const googleUser = await verify(token)
    .catch((e) => {
      return res.status(403)
        .json(
          {
            ok: false,
            mensaje: 'error de token',
            error: e
          }
        );
    });

  Usuario.findOne(
    { email: googleUser.email },
    (err, usuarioBD) => {

      if (err) {
        return res.status(500)
          .json({
            ok: false,
            mensaje: 'Error al buscar usuario',
            errors: err
          });
      }

      if (usuarioBD) {

        if (usuarioBD.google === false) {
          // si se ha registrado como local no pernitimos login con google
          // ya que no hay verificacion con mail
          return res.status(400)
            .json({
              ok: false,
              mensaje: `Tiene que usar autenticación local`
            });
        } else {
          // generamos el token local
          const token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 14400 });

          usuarioBD.password = ';)';
          res.status(200)
            .json(
              {
                ok: true,
                mensaje: 'peticion realizada correctamente',
                body: body,
                id: usuarioBD._id,
                token: token
              }
            );
        }

      } else {
        // el usuario no existe, lo creamos
        const usuario = new Usuario;
        usuario.nombre = googleUser.nombre;
        usuario.email = googleUser.email;
        usuario.image = googleUser.img;
        usuario.role = 'USER_ROLE';
        // hardcoded password
        usuario.password = 'jhvbads3yfdgy%&dsgf65vy/sdgf7yuigd';
        usuario.google = true;

        usuario.save((err, usuarioBD) => {
          const token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 14400 });

          usuarioBD.password = ';)';
          res.status(200)
            .json(
              {
                ok: true,
                mensaje: 'peticion realizada correctamente',
                id: usuarioBD._id,
                token: token
              }
            );
        });
      }

    });


});


///////////////////////////////////////////////////////
/////// autenticación local               /////////////
///////////////////////////////////////////////////////
router.post('/', (req, res) => {

  const body = req.body;

  Usuario.findOne({ email: body.email }, (err, usuariobd) => {

    if (err) {
      return res.status(500)
        .json({
          ok: false,
          mensaje: 'Error al buscar usuario',
          errors: err
        });
    }

    if (!usuariobd) {
      return res.status(400)
        .json({
          ok: false,
          mensaje: `credenciales incorrectas - email`
        });
    }

    if (!bcrypt.compareSync(body.password, usuariobd.password)) {
      return res.status(400)
        .json({
          ok: false,
          mensaje: `credenciales incorrectas - pass`
        });
    }

    // pasados los posibles errores generamos un token
    const token = jwt.sign({ usuario: usuariobd }, SEED, { expiresIn: 14400 });


    usuariobd.password = ';)';
    res.status(200)
      .json(
        {
          ok: true,
          mensaje: 'peticion realizada correctamente',
          body: body,
          id: usuariobd._id,
          token: token
        }
      );

  });


});


module.exports = router;
