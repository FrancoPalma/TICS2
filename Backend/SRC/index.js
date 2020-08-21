const express = require('express');
const app = express();


const session = require('express-session');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

//const { url } = require('./config/database');
const connectDB = require('./config/database')

//mongoose.connect(url);
connectDB();

//Setting
app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));


//Middlewares
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'secreto'
}));

app.use(flash());

//Rutas
router = require('./app/routes/routes');
app.use('/', router)
//require('./app/routes', routes(passport));

//Static files
app.use(express.static(path.join(__dirname,'public')));

//Starting the server

app.listen(app.get('port'), () => {
  console.log('Server on port');
});
