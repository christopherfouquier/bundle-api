'use strict';

var fs      = require('fs'),
    config  = require('./config'),
    date    = require('./date');

var logs = {
    write: function(msg) {
        var d = date.format(new Date()),
            dateFormat = d.day + '/' + d.month + '/' + d.year + ' ' + d.hours + ':' + d.minutes + ':' + d.seconds;

        msg = '[' + dateFormat + '] - > ' + msg + '\n';

        if (config.env == 'dev' || config.env == 'test') {
            console.log(msg);
        }
        else {
            fs.appendFile(__dirname + "/../../logs/error.log", msg, function(err) {
                if (err) throw(err);
            });
        }
    }
};

module.exports = logs;