var express = require('express');
var router = express.Router();

/* GET home page. */
// next utilizado para middleware
router.get('/', (req, res, next) => {
    res.status(200).json(
        {
            ok: true,
            mensaje: 'peticion realizada correctamente'
        }
    );
});

module.exports = router;
