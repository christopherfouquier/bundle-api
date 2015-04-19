var mongoose  = require('mongoose');
var sha1      = require('sha1');
var randtoken = require('rand-token');
var Schema = mongoose.Schema;
var token = randtoken.generate(64);

var UserSchema = new Schema({
    username  :  { type: String, required: true },
    password  :  { type: String, required: true },
    email     :  { type: String, required: true, index: { unique: true } },
    role      :  { type: String, default: "normal" },
    token     :  { type: String, default: token },
    expired   :  { type: Date, default: Date.now },
    created   :  { type: Date, default: Date.now }
});

// @todo: Not working witch findByIdAndUpdate :|
UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  this.password = sha1(this.get('password'));
  next();
});

module.exports = mongoose.model('User', UserSchema);
