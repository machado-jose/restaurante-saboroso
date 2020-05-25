var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//Para criar uma session
var session = require('express-session');
let RedisStore = require('connect-redis')(session);
var redis   = require("redis");
var client  = redis.createClient();
const formidable = require('formidable');

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
// A linha abaixo foi comentada pois estava dando conflito com o middleware criado para o envio do formulário
// Se não fizer isso, a tela de login vai ficar carregando infinitamente
//app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){

  if(req.method === "POST"){

    var form = formidable.IncomingForm({
      uploadDir: path.join(__dirname, 'public/images'),
      keepExtensions: true
    });

    form.parse(req, (err, fields, files)=>{
      req.body = fields;
      req.fields = fields;
      req.files = files;
      next();
    });

  }else{
    next();
  }

});

app.use(session({
  store: new RedisStore({
    host:'localhost',
    logErrors: true,
    port:6379,
    client: client
  }),
    secret:'p@ssw0rd',
    resave:true,
    saveUninitialized:true
}));

app.use('/', indexRouter);
app.use('/admin', adminRouter);

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
