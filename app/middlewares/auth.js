'use strict';

/*
** Module dependencies.
*/
var mongoose    = require('mongoose'),
    User        = mongoose.model('User');

var AuthMiddleware = {
    /*
    ** Check if user is logged
    */
    authorize: function(req, res, next) {
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
    },
    /*
    ** Check if user is admin
    */
    authorizeAdmin: function(req, res, next) {
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
};

module.exports = AuthMiddleware;