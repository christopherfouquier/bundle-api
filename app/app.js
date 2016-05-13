'use strict';

/*
** Module dependencies.
*/
var express         = require('express'),
    logger          = require('morgan'),
    cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    cors            = require('cors'),
    log             = require('./helpers/logs'),
    config          = require('./helpers/config'),
    fs              = require('fs');

// Check variable env NODE_ENV
if (config.env) {
    log.write('NODE_ENV = ' + config.env + '\n');
}
else {
    log.write('NODE_ENV not found');
    config.env = "dev";
    log.write('NODE_ENV = ' + config.env + '\n');
}

// Require connection db
var db  = require('./db.js'),
    app = express();

app.use(logger('dev'));
app.use(express.static(__dirname + '/../public'));
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
var models_path = __dirname + '/models';
fs.readdirSync(models_path).forEach(function (file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file);
});

// Register routes
var routes_path = __dirname + '/routes';
fs.readdirSync(routes_path).forEach(function (file) {
    if (~file.indexOf('.js')) require(routes_path + '/' + file)(app);
});

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    log.write(err);

    // Production error handler, no stacktraces leaked to user
    var error = {};

    if (config.env === 'dev' || config.env === 'test') {
        // Development error handler, will print stacktrace
        error = err;
    }

    res.status(err.status || 500).json({
        message: err.message,
        error: error
    });
});

module.exports = app;
