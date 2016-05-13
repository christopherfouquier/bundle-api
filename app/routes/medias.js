'use strict';

/**
 * Module dependencies.
 */
var medias = require('../controllers/medias');

module.exports = function(app) {
    app.route('/medias')
        .get(medias.list)
        .post(medias.create);

    app.route('/medias/count')
        .get(medias.count);

    app.route('/medias/:mediaId')
        .get(medias.read)
        .put(medias.update)
        .delete(medias.delete);

    app.param('mediaId', medias.mediaByID);
};
