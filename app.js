const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');


app.use(cors());
app.options('*', cors())

//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
//app.use('/public/uploads/draw', express.static(__dirname + '/public/uploads/draw'));
app.use(errorHandler);

//Routes
const usersRoutes = require('./routes/users');
const imagesRoutes = require('./routes/images');
const api = process.env.API_URL;

app.use(`${api}/users`, usersRoutes);
app.use(`${api}/images`, imagesRoutes);

//Database
var conn = mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'luckydraw-database'
})
.then(()=>{
    console.log('Database Connection is ready...')
})
.catch((err)=> {
    console.log(err);
});

//autoIncrement.initialize(conn);

//Server
var host = '0.0.0.0';
var server = app.listen(process.env.PORT|| 3001,host, function(){
    var port = server.address().port;
    console.log('server is running ON port',port);
})