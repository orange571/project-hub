var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var shortId = require("shortid")

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    picture: { type: String, default: '' },
    my_locations: [String],
    isAdmin: {type: Boolean, default: false},
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction"    
        }
    ]
});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);