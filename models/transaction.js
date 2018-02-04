var mongoose = require("mongoose");

var transactionSchema = new mongoose.Schema({
    item: {
        type: String,
        ref: "Item._id"
    },
    librarian: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"        
    },
    lendee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
    },
    initialDate: {
        type: Date, default: Date.now
    }, 
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model("Transaction", transactionSchema);