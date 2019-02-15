const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('./middleware/passport');
const flash = require('connect-flash');
var methodOverride = require('method-override')
const { loggedIn, authJWT } = require('./middleware/auth');

const fileUpload = require('express-fileupload');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const protectedRouter = require('./routes/protected'); // Example of protecting a route through top-level middleware
const cmsRouter = require('./routes/cms');

mongoose.connect(
  'mongodb://localhost:27017/test',
  { useNewUrlParser: true },
  err => {
    if (err) {
      console.log('Error: ', err);
      return;
    }
    console.log('MongoDB is connected');
  }
);
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(methodOverride('_method'))

app.use(
  session({
    secret: 'Secret codeword!',
    // make cookies tied to this session die after one duration
    cookie: { maxAge: 600000 },
    // saveUnitialized: false only allocates space when it is needed, not by default
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

const flashMiddleware = (req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.signin = req.flash('signin');
  next();
};

app.use(flashMiddleware);
app.use(loggedIn); // Check for login to set locals vars

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/protected', authJWT(), protectedRouter);
app.use('/cms', cmsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
