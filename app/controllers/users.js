'use strict';

/*
** Module dependencies.
*/
var mongoose    = require('mongoose'),
    User        = mongoose.model('User'),
    config      = require('../helpers/config'),
    mailer      = require('../helpers/mailer'),
    model       = require('../helpers/model'),
    _           = require('lodash'),
    md5         = require('md5'),
    nodemailer  = require('nodemailer'),
    randtoken   = require('rand-token');

module.exports = {
    list: function(req, res, next) {
        model.getAll(User, req.query, function(err, users) {
            if (err) return next(err);
            res.status(200).json(users);
        });
    },
    userByID: function(req, res, next, id) {
        User.findById(id, function (err, user) {
            if (err) return next(err);
            if (!user) return res.status(404).json({ code: 404, message: 'User not found' });
            req.user = user;
            next();
        });
    },
    getUserByEmail: function(req, res, next) {
        if (req && req.body && req.body.email) {
            User.findOne({ email: req.body.email }, function(err, user) {
                if (err) next(err);
                if (!user) return res.status(404).json({ code: 404, message: 'User not found' });

                res.status(200).json(user);
            });
        }
        else {
            res.status(400).json({ code: 400, message: 'Bad Request' });
        }
    },
    create: function(req, res, next) {
        if (req.body && req.body.email && req.body.password && req.body.firstname && req.body.lastname) {
            User.findOne({ email: req.body.email }, function(err, user) {
                if (err) next(err);
                if (user) return res.status(500).json({ code: 500, message: 'Email already in use' });

                var user = new User(req.body);

                var token = randtoken.generate(512);
                user.token = token;

                user.save(function(err, user) {
                    if (err) {
                        return next(err);
                    }
                    else {
                        mailer({
                            email: user.email,
                            subject: "Registration on project",
                            html: "Hello " + user.lastname + " " + user.firstname + ",<br><br>You just sign up to \"project\", now you connect.<br><br>Bye."
                        }, function(err, info) {
                            if (err) return next(err);
                            res.status(200).json(user);
                        });
                    }
                });
            });
        }
        else {
            res.status(400).json({ code: 400, message: 'Bad Request' });
        }
    },
    /*
    ** Show the current user
    */
    read: function(req, res) {
        res.status(200).json(req.user);
    },
    /*
    ** Update a user
    */
    update: function(req, res, next) {
        var user = req.user;

        user = _.extend(user, req.body);
        user.set("updated_at", Date.now());

        user.save(function(err) {
            if (err) return next(err);
            res.status(200).json(user);
        });
    },
    /*
    ** Delete an user
    */
    delete: function(req, res, next) {
        var user = req.user;

        user.remove(function(err) {
            if (err) return next(err);
            res.status(200).json(user);
        });
    },
    count: function(req, res, next) {
        User.count(function(err, count) {
            if (err) return next(err);
            res.status(200).json(count);
        });
    },
    /*
    ** Connection user
    */
    login: function(req, res, next) {
        if (req.body.email || req.body.password) {
            var email = req.body.email;
            var password = req.body.password;
            User.findOne({ email: email }).populate('club').exec(function(err, user) {
                if (err) return next(err);
                if (!user) {
                    return res.status(500).json({ code: 500, message: 'Invalid username' });
                }
                if (md5(password) !== user.password) {
                    return res.status(500).json({ code: 500, message: 'Invalid password' });
                }
                if (!user.token) {
                    var token = randtoken.generate(512);
                    user.token = token;
                    user.save(function (err) {
                        if (err) return next(err);
                        var currentUser = user;
                        return res.status(200).json(user);
                    });
                }
                else {
                    res.status(200).json(user);
                }
            });
        }
        else {
            res.status(400).json({ code: 400, message: 'Bad Request' });
        }
    },
    /*
    ** Forgot password
    */
    forgot: function(req, res, next) {
        if (req.body.email) {
            var email = req.body.email;
            User.findOne({ email: email }, function(err, user) {
                if (err) return next(err);
                if (user) {
                    var clearNewpassword = randtoken.generate(8);
                    user.password = clearNewpassword;
                    user.save(function(err) {
                        if (err) return next(err);

                        mailer({
                            email: email,
                            subject: "Forgot your password",
                            html: "Hello " + user.lastname + " " + user.firstname + ",<br><br>You just make a password recovery application if you are not the author of this application does not Take into account this email.<br><br>Here is your new password: " + clearNewpassword + "<br><br>For security reasons change your password once you are connected.<br><br>Bye."
                        }, function(err, info) {
                            if (err) return next(err);
                            res.status(200).json({ code: 200, message: 'Password has been reset' });
                        });
                    });
                }
                else {
                    res.status(500).json({ code: 500, message: 'Unknow email' });
                }
            });
        }
    }
};