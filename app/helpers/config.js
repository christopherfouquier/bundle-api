'use strict';

var config = {
    init: function() {
        if (process.env.NODE_ENV) {
            var config = require('../config/pm2/' + process.env.NODE_ENV + '.json').env.config;
        }
        else {
            var config = require('../config/pm2/dev.json').env.config;
        }

        config.env = process.env.NODE_ENV;

        return config;
    }
};

module.exports = config.init();