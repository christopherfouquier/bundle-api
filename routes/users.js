var express = require('express');
var randtoken = require('rand-token');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/User.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find(function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});

/* GET user by id */
router.get('/:id', function(req, res, next) {
  User.findById(req.params.id, function (err, user) {
    if (err) return next(err);
    res.json(user);
  });
});

/* Create new user */
router.post('/', function(req, res, next) {
  User.create(req.body, function (err, user) {
    if (err) return next(err);
    res.json(user);
  });
});

/* Modified user by id */
router.put('/:id', function(req, res, next) {
  User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
    if (err) return next(err);
    res.json(user);
  });
});

/* Delete user by id */
router.delete('/:id', function(req, res, next) {
  User.findByIdAndRemove(req.params.id, req.body, function (err, user) {
    if (err) return next(err);
    res.json(user);
  });
});

/* Sign in user by email and password */
router.post('/login', function(req, res, next) {
  User.findOne(req.body, function (err, user) {
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
          res.json(user);
        });
      }
      else {
        res.json(user);
      }
    }
    else {
      res.json(user);
    }
  });
});

module.exports = router;
