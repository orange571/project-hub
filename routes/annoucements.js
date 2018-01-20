var express = require("express");
var router  = express.Router();
var annoucement = require("../models/annoucement");
var middleware = require("../middleware");


//INDEX - show all annoucements
router.get("/", function(req, res){
    // Get all annoucements from DB
    annoucement.find({}, function(err, allAnnoucements){
       if(err){
           console.log(err);
       } else {
          res.render("annoucements/index",{annoucements:allAnnoucements});
       }
    });
});

//CREATE - add new annoucement to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to annoucements array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newAnnoucement = {name: name, image: image, description: desc, author:author}
    // Create a new annoucement and save to DB
    annoucement.create(newAnnoucement, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to annoucements page
            console.log(newlyCreated);
            res.redirect("/annoucements");
        }
    });
});

//NEW - show form to create new annoucement
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("annoucements/new"); 
});

// SHOW - shows more info about one annoucement
router.get("/:id", function(req, res){
    //find the annoucement with provided ID
    annoucement.findById(req.params.id).populate("comments").exec(function(err, foundAnnoucement){
        if(err){
            console.log(err);
        } else {
            console.log(foundAnnoucement)
            //render show template with that annoucement
            res.render("annoucements/show", {annoucement: foundAnnoucement});
        }
    });
});

// EDIT annoucement ROUTE
router.get("/:id/edit", middleware.checkAnnoucementOwnership, function(req, res){
    annoucement.findById(req.params.id, function(err, foundAnnoucement){
        res.render("annoucements/edit", {annoucement: foundAnnoucement});
    });
});

// UPDATE annoucement ROUTE
router.put("/:id",middleware.checkAnnoucementOwnership, function(req, res){
    // find and update the correct annoucement
    annoucement.findByIdAndUpdate(req.params.id, req.body.annoucement, function(err, updatedAnnoucement){
       if(err){
           res.redirect("/annoucements");
       } else {
           //redirect somewhere(show page)
           res.redirect("/annoucements/" + req.params.id);
       }
    });
});

// DESTROY annoucement ROUTE
router.delete("/:id",middleware.checkAnnoucementOwnership, function(req, res){
   annoucement.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/annoucements");
      } else {
          res.redirect("/annoucements");
      }
   });
});


module.exports = router;

