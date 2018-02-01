var mongoose = require("mongoose");

var announcementSchema = new mongoose.Schema({
   title: String,
   author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   },
   post_body: String,
   createdAt: { type: Date, default: Date.now },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Announcement", announcementSchema);