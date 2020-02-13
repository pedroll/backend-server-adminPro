const express = require('express');
//let path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
// const bodyParser = require('body-parser');

// express
const app = express();
app.use(logger('dev'));
// no es necesario body parser partir de express 4.16
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

// body-parser recibimos el post http y lo convierte en objeto javascript
// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
//app.use(bodyParser.json());

// rutas
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);

// mongo
mongoose.connect(
  'mongodb://localhost:27017/hospitaldb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,

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

// body parser

module.exports = app;
//module.exports = mongoose;

