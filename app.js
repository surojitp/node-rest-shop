const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productsRouts = require('./api/routs/products');
const ordersRouts = require('./api/routs/orders');
const userRouts = require('./api/routs/user');

// mongoose.connect('mongodb://127.0.0.1:27017/nodeShop', { useNewUrlParser: true }, (err, res) => {
//     if (err) throw err;
    
//     console.log('Database online');
//     });

mongoose.connect('mongodb://localhost:27017/nodeShop',
            { useNewUrlParser: true }
        );
mongoose.Promise = global.Promise
    
//mongoose.set('bufferCommands', false);
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

var app = express();

// app.use((req,res,next) =>{
//     res.status(200).json({
//         msg:"it works.."
//     })
// })

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'))
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// app.use((req,res,next)=>{
//     res.header('Access-Control-Allow-Origin','*');
//     res.header(
//         'Access-Control-Allow-Headers','*'
//     )
//     if(req.method === "OPTIONS"){
//         res.header(
//             'Access-Control-Allow-Method',
//             'GET, POST, PUT, DELETE, PATCH'
//         )
//         return res.status(200).json({})
//     }
    
// })

app.use('/products',productsRouts);

app.use('/orders',ordersRouts);

app.use('/user',userRouts);

app.use((req,res,next)=>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    });
});
module.exports = app;