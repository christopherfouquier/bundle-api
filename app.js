'use strict';

/**
 * Module dependencies.
 */
var express         = require('express'),
    logger          = require('morgan'),
    cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    cors            = require('cors'),
    tools           = require('./controllers/tools.js'),
    _               = require('lodash');

// Check variable env NODE_ENV
if (process.env.NODE_ENV) {
    tools.debug('> NODE_ENV = ' + process.env.NODE_ENV + '\n');
}
else {
    tools.debug('> NODE_ENV not found');
    process.env.NODE_ENV = "dev";
    tools.debug('> NODE_ENV = ' + process.env.NODE_ENV + '\n');
}

// Require connection db
var db  = require('./db.js'),
    app = express();

app.use(logger('dev'));
app.use(express.static('public'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: false}));
app.use(cookieParser());
app.use(cors());

// Remove end slash url
app.use(function(req, res, next) {
    if (req.url.substr(-1) == '/' && req.url.length > 1) {
       res.redirect(301, req.url.slice(0, -1));
    }
    else {
       next();
    }
});

// Register models
var User            = require('./models/User.js'),
    Media           = require('./models/Media.js');

// Register routes
require('./routes/users')(app);
require('./routes/medias')(app);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Development error handler, will print stacktrace
if (app.get('env') === 'dev' || app.get('env') === 'test') {
    app.use(function(err, req, res, next) {
        tools.debug({
            message: err.message,
            error: err
        });
        res.status(err.status || 500).json({
            message: err.message,
            error: err
        });
    });
}

// Production error handler, no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500).json({
        message: err.message,
        error: {}
    });
});

module.exports = app;
