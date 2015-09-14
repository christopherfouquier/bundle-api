'use strict';

/**
 * Module dependencies.
 */
var config      = require('config'),
    _           = require('lodash'),
    nodemailer  = require('nodemailer');

/**
 * console.log activate in env dev
 */
exports.debug = function(param) {
    if (config.env == 'dev') {
        console.log(param);
    }
};

/**
 * Get configuration
 */
exports.config = function() {
    // Check file of config
    try {
        var config_env = require('../config/pm2_' + process.env.NODE_ENV + '.json\n');
    }
    catch(e) {
        var config_env = require('../config/default.json');
    }

    // Merge file config env with config common
    var common = require('../config/common.json'),
        config = _.merge(config_env, common);

    return config;
};

/**
 * Get all items in model
 */
exports.getAll = function(model, req, res, next) {
    var options = {},
        orderBy = { created_at: "desc" };

    if (req.query && req.query.orderBy) {
        try {
            var newOrderBy = JSON.parse(req.query.orderBy);
            orderBy = newOrderBy;
        }
        catch (e) {
            tools.debug(e);
            return res.status(500).json({ code: 500, message: 'Internal server error.' });
        }
    }

    if (req.query && req.query.options) {
        try {
            var newOptions = JSON.parse(req.query.options);
            options = _.extend(options, newOptions);
        }
        catch (e) {
            tools.debug(e);
            return res.status(500).json({ code: 500, message: 'Internal server error.' });
        }
    }

    if (req.query && req.query.limit && req.query.skip) {
        model.find(options).skip(req.query.skip).limit(req.query.limit).sort(orderBy).exec(function (err, sites) {
            if (err) return next(err);
            res.status(200).json(sites);
        });
    }
    else {
        model.find(options).sort(orderBy).exec(function (err, sites) {
            if (err) return next(err);
            res.status(200).json(sites);
        });
    }
};

/**
 * Service mailer
 * @param (object) data
 * @param (function) cb
 */
exports.mailer = function(data, cb) {
    var transporter = nodemailer.createTransport({
        // service: 'Gmail',
        // auth: {
        //     user: 'christopher@clintagency.com',
        //     pass: '*******'
        // },
        host: config.mailer.host,
        port: config.mailer.port
    });
    transporter.sendMail({
        from: config.mailer.from,
        to: data.email,
        subject: data.subject,
        html: data.html
    }, cb);
};