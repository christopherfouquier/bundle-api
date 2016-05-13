'use strict';

var _ = require('lodash');

var model = {
    getAll: function(model, query, cb) {
        var options = {},
        orderBy = { created_at: "desc" };

        if (query && query.orderBy) {
            try {
                var newOrderBy = JSON.parse(query.orderBy);
                orderBy = newOrderBy;
            }
            catch (err) {
                if(cb && typeof cb == "function") {
                    cb(err, {});
                }
            }
        }

        if (query && query.options) {
            try {
                var newOptions = JSON.parse(query.options);
                options = _.extend(options, newOptions);
            }
            catch (err) {
                if(cb && typeof cb == "function") {
                    cb(err, {});
                }
            }
        }

        if (query && query.limit && query.skip) {
            model.find(options).skip(query.skip).limit(query.limit).sort(orderBy).exec(function (err, data) {
                if(cb && typeof cb == "function") {
                    cb(err, data);
                }
            });
        }
        else {
            model.find(options).sort(orderBy).exec(function (err, sites) {
                if(cb && typeof cb == "function") {
                    cb(err, data);
                }
            });
        }
    }
};

module.exports = model;