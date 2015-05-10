module.exports = function(mongoose, conn) {
    var UserSchema = new mongoose.Schema({
	_id       :  { type: String },
        username  :  { type: String, required: true },
        password  :  { type: String, required: true },
        email     :  { type: String, required: true, index: { unique: true } },
        role      :  { type: String, default: "normal" },
        token     :  { type: String, default: 0 },
        expired   :  { type: Date, default: Date.now },
        created   :  { type: Date, default: Date.now }
    });

    return {
        name: 'User',
        schema: UserSchema
    };
}