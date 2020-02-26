const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
//const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const hospitalRouter = require('./routes/hospital');
const medicoRouter = require('./routes/medico');
const busquedaRouter = require('./routes/busqueda');
const uploadRouter = require('./routes/upload');
const imagenesRouter = require('./routes/imagenes');
// const bodyParser = require('body-parser');

// express
const app = express();

// CORS en produccion utilizar 'express cors' en lugar de esto
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'DELETE, POST, PUT, GET, OPTIONS');
  res.header('Allow', 'DELETE, POST, PUT, GET, OPTIONS');
  next();
});
// app.use(cors());

app.use(logger('dev'));
// no es necesario body parser partir de express 4.16
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

// body-parser recibimos el post http y lo convierte en objeto javascript
// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
//app.use(bodyParser.json());

// rutas
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/hospital', hospitalRouter);
app.use('/medico', medicoRouter);
app.use('/busqueda', busquedaRouter);
app.use('/upload', uploadRouter);
app.use('/img', imagenesRouter);

// mongo
mongoose.connect(
  'mongodb://localhost:27017/hospitaldb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false

  });
const db = mongoose.connection;
db.on(
  'error',
  console.error.bind(console, 'connection error:'));
db.once(
  'open',
  () => {
    console.log('conectado a base de datos');
    // we're connected!
  });

// mostrar archivos en ruta
// let serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'));
// app.use('/uploads', serveIndex(__dirname + '/uploads'));
// body parser

module.exports = app;
//module.exports = mongoose;

