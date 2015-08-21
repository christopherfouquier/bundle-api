var express  = require('express'),
    mongoose = require('mongoose'),
    app      = express(),
    tools    = require('./controllers/tools.js'),
    config   = tools.config(),
    dbURI    = 'mongodb://'+ config.db.host +':'+ config.db.port +'/'+ config.db.dbname;

// Create the database connection
mongoose.connect(dbURI);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    // @TODO: Drop database with TestUnit, not start api
    if (app.get('env') === 'test') {
        mongoose.connection.db.dropDatabase(function() {
            tools.debug('> Drop Database => '+dbURI);
            tools.debug('> Mongoose default connection open to ' + dbURI + '\n');
        });
    }
    else {
        tools.debug('> Mongoose default connection open to ' + dbURI + '\n');
    }
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
    tools.debug('> Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    tools.debug('> Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        tools.debug('> Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});
