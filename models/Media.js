var mongoose        = require('mongoose'),
    Schema          = mongoose.Schema,
    MediaSchema      = new Schema({
        name        :  { type: String },
        url         :  { type: String },
        created_at  :  { type: Date, default: Date.now },
        updated_at  :  { type: Date, default: null }
    });

module.exports = mongoose.model('Media', MediaSchema);
