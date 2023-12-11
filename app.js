var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var electric_usersRouter = require('./routes/electri_users');
var electric_boardsRouter = require('./routes/electri_boards');
var electron_usersRouter = require('./routes/electron_users');
var electron_boardsRouter = require('./routes/electron_boards');
var electrom_usersRouter = require('./routes/electrom_users');
var electrom_boardsRouter = require('./routes/electrom_boards');

const session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var session_opt = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 }
};
app.use(session(session_opt));

app.use('/', indexRouter);
app.use('/electri_users', electric_usersRouter);
app.use('/electri_boards', electric_boardsRouter);
app.use('/electron_users', electron_usersRouter);
app.use('/electron_boards', electron_boardsRouter);
app.use('/electrom_users', electrom_usersRouter);
app.use('/electrom_boards', electrom_boardsRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
