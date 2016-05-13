var express  = require('express'),
    mongoose = require('mongoose'),
    app      = express(),
    log      = require('./helpers/logs'),
    config   = require('./helpers/config'),
    dbURI    = 'mongodb://'+ config.db.host +':'+ config.db.port +'/'+ config.db.dbname;

// Create the database connection
mongoose.connect(dbURI);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    if (app.get('env') === 'test') {
        mongoose.connection.db.dropDatabase(function() {
            log.write('Drop Database ' + config.db.name);
        });
    }

    log.write('Mongoose default connection open to ' + dbURI + '\n');
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
    log.write('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    log.write('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        log.write('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});
