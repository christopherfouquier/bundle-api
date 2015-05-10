var express = require('express');
var randtoken = require('rand-token');
var sha1 = require('sha1');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/User.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
    User.find(function (err, users) {
	if (err) return next(err);
	res.status(200).json(users);
    });
});

/* GET user by id */
router.get('/:id', function(req, res, next) {
    User.findById(req.params.id, function (err, user) {
	if (err) return next(err);
	res.status(200).json(user);
    });
});

/* Create new user */
router.post('/', function(req, res, next) {
    User.create(req.body, function (err, user) {
	if (err) return next(err);
	res.status(200).json(user);
    });
});

/* Modified user by id */
router.put('/:id', function(req, res, next) {
    User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
	if (err) return next(err);
	res.status(200).json(user);
    });
});

/* Delete user by id */
router.delete('/:id', function(req, res, next) {
    User.findByIdAndRemove(req.params.id, req.body, function (err, user) {
	if (err) return next(err);
	res.status(200).json(user);
    });
});

/* Sign in user by email and password */
router.post('/login', function(req, res, next) {
    if (!req.body.email || !req.body.password) {
	return res.status(500).json({code: 500, message: "Internal Server"});
    }
    login = req.body.email;
    password = req.body.password;
    User.findOne({ 'email': login, 'password': sha1(password) }, function (err, user) {
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
	    res.status(500).json(user);
	}
    });
});

module.exports = router;
