var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/User.js');

router.all('/*', function(req, res, next) {
    if (req.path == '/users/login') {
	next();
    }
    else {
	if (req.query.token) {
	    User.findOne({token: req.query.token}, function (err, user) {
		if (err) return next(err);
		if (user) {
		    var ONE_DAY = 1000 * 60 * 60 * 24,
		    date1 = user.expired,
		    date2 = new Date(),
		    datediff = Math.round((Math.abs(date1.getTime() - date2.getTime()))/ONE_DAY);
		    if (datediff >= 31) {
			var token = randtoken.generate(64),
			expired = new Date();
			User.findByIdAndUpdate(user.id, {token: token, expired: expired}, function (err, user) {
			    if (err) return next(err);
			    res.status(200).json(user);
			});
		    }
		    else {
			res.status(200).json(user);
		    }
		}
		else {
		    res.status(401).json({code: 401, message: "Unauthorized"});
		}
	    });
	}
	else {
	    res.status(401).json({code: 401, message: "Unauthorized"});
	}
    }
});

module.exports = router;