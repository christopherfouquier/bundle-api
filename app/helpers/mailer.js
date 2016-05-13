'use strict';

var config      = require('./config').mailer,
    _           = require('lodash'),
    nodemailer  = require('nodemailer');

module.exports = function(data, cb) {
    var options     = { ignoreTLS: true },
        from_email  = config.from;;

    if (!_.isEmpty(config.gmail.auth.user) && !_.isEmpty(config.gmail.auth.user)) {
        _.extend(options, config.gmail);
    }
    else {
        _.extend(options, config.smtp);
    }

    var transporter = nodemailer.createTransport(options);

    if (data.from) {
        from_email = data.from;
    }

    transporter.sendMail({
        from: from_email,
        to: data.email,
        subject: data.subject,
        html: data.html,
        attachments: data.attachments
    }, cb);
};