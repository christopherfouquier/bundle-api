'use strict';

/**
 * Module dependencies.
 */
var users = require('../controllers/users');

module.exports = function(app) {
    app.route('/users')
        .get(users.list)
        .post(users.create);

    app.route('/users/:userId')
        .get(users.read)
        .put(users.update)
        .delete(users.delete);

    app.param('userId', users.userByID);

    app.route('/login')
        .post(users.login);

    app.route('/forgot')
        .post(users.forgot);

    app.route('/users/email')
        .post(users.getUserByEmail);
};
