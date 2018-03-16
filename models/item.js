var mongoose = require("mongoose");

var itemSchema = new mongoose.Schema({
    name: String,
    image: String,
    shortid: String,
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
            ref: "Transaction"    
        }
    ]
});

module.exports = mongoose.model("Item", itemSchema);