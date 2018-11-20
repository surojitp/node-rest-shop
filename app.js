var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = morgan = require('morgan');

////////
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//const cors = require("cors");

const productsRouts = require('./api/routs/products');
const ordersRouts = require('./api/routs/orders');
const userRouts = require('./api/routs/user');
const categoryRouts = require('./api/routs/category');
const subCategoryRouts = require('./api/routs/subCategory');
const cartRoutes = require('./api/routs/cart');

var app = express();
//app.use(cors());

//////



//////////db///

mongoose.connect('mongodb://admin:admin1234@ds045157.mlab.com:45157/nodeshop',
            { useNewUrlParser: true }
        );
mongoose.Promise = global.Promise
    
//mongoose.set('bufferCommands', false);
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'))




app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'))
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//////// end db /////

app.use((req,res,next)=>{
  // res.setHeader('Access-Control-Allow-Origin','*');
  // res.setHeader(
  //     'Access-Control-Allow-Headers','*'
  // );
  // res.setHeader('Access-Control-Allow-Credentials', true);
  
  // if(req.method === "OPTIONS"){
  //     res.setHeader(
  //         'Access-Control-Allow-Method',
  //         'GET, POST, PUT, DELETE, PATCH'
  //     )
  //     return res.status(200).json({})
  // }

  // // Pass to next layer of middleware
  // next(); 
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', "*");

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
  
})

app.use('/products',productsRouts);

app.use('/orders',ordersRouts);

app.use('/user',userRouts);

app.use('/category', categoryRouts);

app.use('/subcategory', subCategoryRouts);

app.use('/cart', cartRoutes);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
