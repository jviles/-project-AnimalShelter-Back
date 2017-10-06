const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');

const response = require('./helpers/response');
const configure = require('./config/passport');
const animals = require('./routes/animals');
const shelters = require ('./routes/shelters');
const auth = require('./routes/auth');

const app = express();

mongoose.connect('mongodb://localhost/app-todo-db');

app.use(session({
    secret: 'todo-app',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
}));

app.use(cors({
    credentials: true,
    origin: ['http://localhost:4200']
}));

configure(passport);

app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use('/animals', animals);
app.use('/shelters',shelters);
app.use('/auth', auth);

// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    res.status(404).json({error: 'Not found'});
});

// error handlers
app.use(function(err, req, res, next) {
    console.log(req.method, req.path, err);
    if (!headers.sent) {
        res.status(500).json({error: 'Unexpected error'});
    }
});


module.exports = app;
