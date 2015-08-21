'use strict';

/**
 * Module dependencies.
 */
var mongoose    = require('mongoose'),
    _           = require('lodash'),
    Media       = mongoose.model('Media'),
    tools       = require('./tools.js'),
    config      = tools.config();

/**
 * List of Medias
 */
exports.list = function(req, res, next) {
    Media.find().sort('-created_at').exec(function (err, medias) {
        if (err) return next(err);

        for (var i = 0; i < medias.length; i++) {
            medias[i].url = config.api.host + ':' + config.api.port + '/uploads/' + medias[i].url;
        };

        res.status(200).json(medias);
    });
};

/**
 * Media middleware
 */
exports.mediaByID  = function(req, res, next, id) {
    Media.findById(id, function (err, media) {
        if (err) return next(err);
        if (!media) return res.status(404).json({ message: 'Media not found.' });
        if (media.url) {
            media.url = config.api.host + ':' + config.api.port + '/uploads/' + media.url;
        }
        req.media = media;
        next();
    });
};

/**
 * Create a media
 */
exports.create = function(req, res, next) {
    if (req.body && req.body.name) {

        var base64Image = req.body.base64,
            path = require('path'),
            upload = path.resolve(path.join(__dirname, '../public/uploads'), req.body.url),
            decodedImage = new Buffer(base64Image, 'base64');

        require("fs").writeFile(upload, decodedImage, function(err) {
            if (err) return next(err);
            tools.debug('uploads save');
        });

        Media.findOne({ name: req.body.name }, function(err, media) {
            if (err) next(err);
            if (media) return res.status(500).json({ code: 500, message: 'Nom déjà utilisé' });

            var media = new Media(req.body);

            media.save(function(err, media) {
                if (err) {
                    return next(err);
                }
                else {
                    res.status(200).json(media);
                }
            });
        });
    }
    else {
        res.status(400).json('Bad Request.');
    }
};

/**
 * Show the current media
 */
exports.read = function(req, res) {
    res.status(200).json(req.media);
};

/**
 * Update a media
 */
exports.update = function(req, res, next) {
    var media = req.media;

    media = _.extend(media, req.body);

    media.save(function(err) {
        if (err) return next(err);
        res.status(200).json(media);
    });
};

/**
 * Delete a media
 */
exports.delete = function(req, res, next) {
    var media = req.media,
        fs = require("fs"),
        path = require("path"),
        arrayUrl = media.url.split('/'),
        filename = arrayUrl[arrayUrl.length - 1],
        url = path.resolve(path.join(__dirname, '../public/uploads'), filename);

    fs.stat(url, function(err, stat) {
        if (err == null) {
            tools.debug('File exists');

            fs.unlink(url, function() {
                media.remove(function(err) {
                    if (err) {
                        return next(err);
                    }
                    else {
                        res.status(200).json(media);
                    }
                });
            });

        }
        else if (err.code == 'ENOENT') {
            tools.debug('Some log\n');
            res.status(500).json({ code: 500, message: err.code });
        }
        else {
            tools.debug('Some other error: ', err.code);
            res.status(500).json({ code: 500, message: err.code });
        }
    });
};