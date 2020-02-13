let express = require('express');
//let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let mongoose = require('mongoose');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// conexion BD
// mongoose.conexion.openUri('mongodb://localhost:27017/hospitaldb',{
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });
mongoose.connect('mongodb://localhost:27017/hospitaldb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('conectado a base de datos');
    // we're connected!
});


// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb://localhost:27017/hospitaldb?retryWrites=true&w=majority";
// const client = new MongoClient(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });
module.exports = app;
//module.exports = mongoose;

