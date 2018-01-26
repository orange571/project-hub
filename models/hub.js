var mongoose = require("mongoose");

var hubSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   email: String,
   phoneNumber: String,
   location: String,
   lat: Number,
   lng: Number,
   /**
   mainContact: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },**/
});

module.exports = mongoose.model("Hub", hubSchema);