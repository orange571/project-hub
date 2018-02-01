var mongoose = require("mongoose");
var shortid = require("shortid");

var itemSchema = new mongoose.Schema({
    name: String,
    image: String,
    shortid: {
        type: String,
        'default': shortid.generate
    },
    description: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: { type: Date, default: Date.now },
    isCheckedOut: {
        type: Boolean,
        default: false
    },
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"    
        }
    ]
});

module.exports = mongoose.model("Item", itemSchema);