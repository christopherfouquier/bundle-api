var tools       = require('../controllers/tools.js'),
    supertest   = require('supertest'),
    request     = supertest(tools.config().api.host + ':' + tools.config().api.port),
    data        = require('./data.json');

describe('Media', function() {
    describe('Create a media', function() {
        it('create without errors', function(done) {
            request
                .post('/medias')
                .send(data.media1)
                .accept('json')
                .type('json')
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Select all medias', function() {
        it('select without errors', function(done) {
            request
                .get('/medias')
                .accept('json')
                .type('json')
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Update a media', function() {
        it('update without errors', function(done) {
            request
                .post('/medias')
                .send(data.media2)
                .accept('json')
                .type('json')
                .end(function(err, res) {
                    if (err) return done(err);

                    data2 = { name: 'Test' };

                    request
                        .put('/medias/' + res.body._id)
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

    describe('Delete a media', function() {
        it('delete without errors', function(done) {

            request
                .post('/medias')
                .send(data.media3)
                .accept('json')
                .type('json')
                .end(function(err, res) {
                    if (err) return done(err);

                    request
                        .delete('/medias/' + res.body._id)
                        .accept('json')
                        .type('json')
                        .end(function(err, res) {
                            if (err) return done(err);
                            done();
                        });
                });
        });
    });
});