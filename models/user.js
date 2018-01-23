var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    picture: { type: String, default: 'https://i.imgur.com/6SMo9yE.jpg' },
    my_locations: [String],
    priviledges: [String]
});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);