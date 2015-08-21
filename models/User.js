var mongoose        = require('mongoose'),
    md5             = require('md5'),
    Schema          = mongoose.Schema,
    UserSchema      = new Schema({
        firstname   :  { type: String, required: true },
        lastname    :  { type: String, required: true },
        password    :  { type: String },
        email       :  { type: String, required: true, index: { unique: true } },
        role        :  { type: String, default: "normal" },
        token       :  { type: String },
        created_at  :  { type: Date, default: Date.now },
        updated_at  :  { type: Date, default: null }
    });

// @TODO: Not working witch findByIdAndUpdate :|
UserSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    this.password = md5(this.get('password'));
    next();
});

module.exports = mongoose.model('User', UserSchema);