var tools       = require('../controllers/tools.js'),
    supertest   = require('supertest'),
    request     = supertest(tools.config().api.host + ':' + tools.config().api.port)
    data        = require('./data.json');

describe('User', function() {
    describe('Create a user', function() {
        it('create without errors', function(done) {
            request
                .post('/users')
                .send(data.user1)
                .accept('json')
                .type('json')
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Select all users', function() {
        it('select without errors', function(done) {
            request
                .get('/users')
                .accept('json')
                .type('json')
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Select a user by email', function() {
        it('select without errors', function(done) {
            request
                .post('/users/email')
                .send({ email: data.user1.email })
                .accept('json')
                .type('json')
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Update a user', function() {
        it('update without errors', function(done) {
            request
                .post('/users')
                .send(data.user2)
                .accept('json')
                .type('json')
                .end(function(err, res) {
                    if (err) return done(err);

                    data2 = { firstname: 'Test' };

                    request
                        .put('/users/' + res.body._id)
                        .send(data2)
                        .accept('json')
                        .type('json')
                        .end(function(err, res) {
                            if (err) return done(err);
                            done();
                        });
                });
        });
    });

    describe('Delete a user', function() {
        it('delete without errors', function(done) {
            request
                .post('/users')
                .send(data.user3)
                .accept('json')
                .type('json')
                .end(function(err, res) {
                    if (err) return done(err);

                    request
                        .delete('/users/' + res.body._id)
                        .accept('json')
                        .type('json')
                        .end(function(err, res) {
                            if (err) return done(err);
                            done();
                        });
                });
        });
    });

    describe('Login', function() {
        it('connection without errors', function(done) {
            request
                .post('/login')
                .send({ email: data.user1.email, password: data.user1.password })
                .accept('json')
                .type('json')
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Forgot', function() {
        it('forgot password without errors', function(done) {
            request
                .post('/forgot')
                .send({ email: data.user1.email })
                .accept('json')
                .type('json')
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
        });
    });
});