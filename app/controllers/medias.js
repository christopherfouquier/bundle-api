'use strict';

/**
 * Module dependencies.
 */
var mongoose    = require('mongoose'),
    Media       = mongoose.model('Media'),
    config      = require('../helpers/config'),
    log         = require('../helpers/logs'),
    model       = require('../helpers/model'),
    _           = require('lodash'),
    fs          = require('fs'),
    mime        = require('mime-types'),
    path        = require('path'),
    sizeOf      = require('image-size');

module.exports = {
    list: function(req, res, next) {
        model.getAll(Media, req.query, function(err, data) {
            if (err) return next(err);
            res.status(200).json(data);
        });
    },
    mediaByID: function(req, res, next, id) {
        Media.findById(id, function (err, media) {
            if (err) return next(err);
            if (!media) return res.status(404).json({ code: 404, message: 'Media not found' });
            req.media = media;
            next();
        });
    },
    create: function(req, res, next) {
        log.write(req.body);
        if (req && req.body && req.body.name && req.body.base64 && req.body.filename) {

            var base64Image     = req.body.base64,
                path            = require('path'),
                upload          = path.resolve(path.join(__dirname, '../../public/uploads'), req.body.filename),
                decodedImage    = new Buffer(base64Image, 'base64');

            require("fs").writeFile(upload, decodedImage, function(err) {
                if (err) return next(err);

                var dimensions  = sizeOf(upload),
                    stats       = fs.statSync(upload),
                    extension   = path.extname(upload).replace('.', ''),
                    type        = mime.lookup(upload);

                type = type.split('/')[0];

                var meta = { width: dimensions.width, height: dimensions.height, size: stats['size'], extension: extension, type: type };
                _.extend(req.body, meta);

                Media.findOne({ name: req.body.name }, function(err, media) {
                    if (err) next(err);
                    if (media) return res.status(500).json({ code: 500, message: 'Name already in use' });

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
            });
        }
        else {
            res.status(400).json({ code: 400, message: 'Bad Request' });
        }
    },
    read: function(req, res) {
        res.status(200).json(req.media);
    },
    update: function(req, res, next) {
        var media = req.media;

        media = _.extend(media, req.body);

        media.save(function(err) {
            if (err) return next(err);
            res.status(200).json(media);
        });
    },
    delete: function(req, res, next) {
        var media       = req.media,
            pathname    = path.resolve(path.join(__dirname, '../../public/uploads'), media.filename);

        fs.stat(pathname, function(err, stat) {
            if (err) return next(err);

            fs.unlink(pathname, function() {
                media.remove(function(err) {
                    if (err) return next(err);
                    res.status(200).json(media);
                });
            });
        });
    },
    count: function(req, res, next) {
        Media.count(function(err, count) {
            if (err) return next(err);
            res.status(200).json(count);
        });
    }
};