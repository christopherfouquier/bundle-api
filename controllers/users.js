'use strict';

/**
 * Module dependencies.
 */
var mongoose    = require('mongoose'),
    nodemailer  = require('nodemailer'),
    _           = require('lodash'),
    md5         = require('md5'),
    randtoken   = require('rand-token'),
    tools       = require('./tools.js'),
    config      = tools.config(),
    User        = mongoose.model('User');

/**
 * List of Users
 */
exports.list = function(req, res, next) {
    tools.getAll(User, req, res, next);
};

/**
 * User middleware
 */
exports.userByID  = function(req, res, next, id) {
    User.findById(id, function (err, user) {
        if (err) return next(err);
        if (!user) return res.status(404).json({ message: 'User not found.' });
        req.user = user;
        next();
    });
};

/**
 * Get user by email
 */
exports.getUserByEmail = function(req, res, next) {
    var email = req.body.email;

    if (email) {
        User.findOne({email: email}, function(err, user) {
            if (err) next(err);
            if (!user) return res.status(404).json({ message: 'User not found.' });

            res.status(200).json(user);
        });
    }
    else {
        res.status(400).json('Bad Request.');
    }
}

/**
 * Create a user
 */
exports.create = function(req, res, next) {
    if (req.body && req.body.email && req.body.password && req.body.firstname && req.body.lastname) {
        User.findOne({ email: req.body.email }, function(err, user) {
            if (err) next(err);
            if (user) return res.status(500).json({ code: 500, message: 'Email déjà utilisé' });

            var user = new User(req.body);

            var token = randtoken.generate(512);
            user.token = token;

            user.save(function(err, user) {
                if (err) {
                    return next(err);
                }
                else {
                    tools.mailer({
                        email: user.email,
                        subject: 'Confirmation d\'inscription',
                        html: ''
                    }, function(err,info) {
                        if (err) return next(err);
                        res.status(200).json(user);
                    });
                }
            });
        });
    }
    else {
        res.status(400).json('Bad Request.');
    }
};

/**
 * Show the current user
 */
exports.read = function(req, res) {
    res.status(200).json(req.user);
};

/**
 * Update a user
 */
exports.update = function(req, res, next) {
    var user = req.user;

    // Find tag
    if (req.body.club) {
        Tag.findOne({slug: req.body.club}, function(err, tag) {
            if (err) return next(err);
            callback(tag._id);
        });
    }
    else {
        callback(null);
    }

    function callback(tag) {
        user = _.extend(user, req.body);
        user.club = tag;

        user.save(function(err) {
            if (err) return next(err);
            user.populate('club', function(err, newUser) {
                if (err) {
                    return next(err);
                }
                else {
                    res.status(200).json(newUser);
                }
            });
        });
    }
};

/**
 * Delete an user
 */
exports.delete = function(req, res, next) {
    var user = req.user;

    user.remove(function(err) {
        if (err) {
            return next(err);
        }
        else {
            res.status(200).json(user);
        }
    });
};

/**
 * Connection user
 */
exports.login = function(req, res, next) {
    if (req.body.email || req.body.password) {
        var email = req.body.email;
        var password = req.body.password;
        User.findOne({ email: email }).populate('club').exec(function(err, user) {
            if (err) return next(err);
            if (!user) {
                return res.status(500).json('Incorrect username.');
            }
            if (md5(password) !== user.password) {
                return res.status(500).json('Incorrect password.');
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
        res.status(400).json('Bad Request.');
    }
};

/**
 * Forgot password
 */
exports.forgot = function(req, res, next) {
    if (req.body.email) {
        var email = req.body.email;
        User.findOne({ email: email }, function(err, user) {
            if (err) return next(err);
            if (user) {
                var clearNewpassword = randtoken.generate(8);
                user.password = clearNewpassword;
                user.save(function(err) {
                    if (err) return next(err);

                    tools.mailer({
                        email: email,
                        subject: 'Votre nouveau mot de passe',
                        html: ''
                    }, function(err,info) {
                        if (err) return next(err);
                        res.status(200).json('Password has been reset.');
                    });
                });
            }
            else {
                res.status(500).json('Unknow email.');
            }
        });
    }
};

/**
 * Check if user is logged
 */
exports.isLogged = function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        User.findOne({ token: token }, function(err, user) {
            if (err) return next(err);
            if (!user) {
                res.status(403).json({ code: 403, message: 'Invalid token.' });
            }
            next();
        });
    }
    else {
        return res.status(401).json({ code: 401, message: 'Unauthorized.' });
    }
}

/**
 * Check if user is admin
 */
exports.isAdmin = function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        User.findOne({ token: token }, function(err, user) {
            if (err) return next(err);
            if (!user) {
                res.status(403).json({ code: 403, message: 'Invalid token.' });
            }
            if (user.role != 'admin') {
                return res.status(403).json({ code: 403, message: 'Forbidden.' });
            }
            else {
                next();
            }
        });
    }
    else {
        return res.status(401).json({ code: 401, message: 'Unauthorized.' });
    }
}