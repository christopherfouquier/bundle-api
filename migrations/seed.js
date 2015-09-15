var fs       = require('fs'),
    mongoose = require('mongoose'),
    async    = require('async'),
    tools    = require('../controllers/tools.js'),
    User     = require('../models/User.js'),
    User     = mongoose.model('User');

// Check variable env NODE_ENV
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "dev";
}

// Require connection db
require('../db.js');

file = './migrations/data.json';
fs.exists(file, function(exists) {
    if (exists) {
        var data = JSON.parse(fs.readFileSync(file, 'utf8'));

        if (data.hasOwnProperty('users')) {
            data = data.users;

            // Add user in db
            async.each(data, function(usr, cb) {

                User.findOne({ email: usr.email }, function(err, user) {
                    if (err) cb(err);
                    if (user) cb('Email already in use');

                    var user = new User(usr);

                    user.save(function(err, user) {
                        if (err) cb(err);
                        cb();
                    });
                });

            }, function(err) {
                if (err)
                    console.error(err);
                else
                    console.log('Migrations success.');

                process.exit();
            });
        }
    }
    else {
        console.error(file + ' not found.');
        process.exit();
    }
});