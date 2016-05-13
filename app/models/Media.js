var mongoose        = require('mongoose'),
    Schema          = mongoose.Schema,
    config          = require('../helpers/config'),
    MediaSchema     = new Schema({
        name        :  { type: String, default: "" },
        filename    :  { type: String, default: "" },
        size        :  { type: Number, default: null },
        height      :  { type: Number, default: null },
        width       :  { type: Number, default: null },
        type        :  { type: String, default: "" },
        extension   :  { type: String, default: "" },
        created_at  :  { type: Date, default: Date.now },
        updated_at  :  { type: Date, default: null }
    }, {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    });

MediaSchema.virtual('url').get(function () {
    return config.api.host + ':' + config.port + '/uploads/' + this.filename;
});

module.exports = mongoose.model('Media', MediaSchema);
