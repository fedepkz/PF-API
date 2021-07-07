var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUI = require("swagger-ui-express")

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Covid Alert',
      version: '1.0.0',
      description: "This is an API for the application CovidAlert"
    },
    servers: [
      {
        url: "https://salty-bayou-33689.herokuapp.com",
      },
    ],
  },
  apis: ['./routes/*.js'], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);
//console.log(openapiSpecification)

var usersRouter = require('./routes/users');
var meetingsRouter = require('./routes/meetings');
var statesRouter = require('./routes/states');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//MANEJO DE CACHÉ, PARA EVITAR 304
app.use(function (req, res, next) {
  res.set('Cache-control', `no-store`)
  next()
})


app.use('/api/docs/v1',swaggerUI.serve, swaggerUI.setup(openapiSpecification))
app.use('/api/users', usersRouter);
app.use('/api/meetings', meetingsRouter);
app.use('/api/states', statesRouter);




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
