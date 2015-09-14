var mongoose = require('mongoose')
    tools    = require('../controllers/tools.js');

before(function(done) {
    var dbURI = "mongodb://" + tools.config().db.host + ":" + tools.config().db.port + "/" + tools.config().db.dbname;

    mongoose.connect(dbURI);

    mongoose.connection.on('connected', function () {
        mongoose.connection.db.dropDatabase(function() {
            console.log('Drop Database => ' + dbURI);
            console.log('Mongoose default connection open to ' + dbURI);
            done();
        });
    });

    mongoose.connection.on('error',function (err) {
        console.log('Mongoose default connection error: ' + err);
    });

    mongoose.connection.on('disconnected', function () {
        console.log('Mongoose default connection disconnected');
    });

    process.on('SIGINT', function() {
        mongoose.connection.close(function () {
            console.log('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });
});