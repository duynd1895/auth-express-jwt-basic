const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();


dotenv.config();
mongoose.connect('mongodb://localhost:27017/dang-nhap', { useNewUrlParser: true }, (err, client) => {
     if (err) {
        return console.log('Unable to connect to database');  
     } 
     console.log('Ket Noi Thanh Cong Toi Database');
});

const userRoute = require('./routes/user');
const postRoute = require('./routes/post');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use((req,res,next) => {
     res.header("Access-Control-Allow-Origin", "*");
     res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, Authorization"
     );
     if (req.method ==="OPTIONS") {
          res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
          return res.status(200).json({

          });
     }
     next();
});

app.use('/api/user', userRoute);
app.use('/api/post', postRoute);

module.exports = app;