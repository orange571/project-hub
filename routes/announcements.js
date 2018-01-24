var express = require("express");
var router  = express.Router();
var Announcement = require("../models/announcement");
var middleware = require("../middleware");


//INDEX - show all announcements
router.get("/", function(req, res){
    // Get all announcements from DB
    Announcement.find({}, function(err, allAnnouncements){
       if(err){
           console.log(err);
       } else {
           console.log("trying to show announcements/index")
          res.render("announcements/index",{announcements:allAnnouncements});
          
       }
    });
  console.log("This was an attempt at get / for in the annoucments.js")
});

//CREATE - add new announcement to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to announcements array
    var title = req.body.title;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var post_body = req.body.post_body;
    var newAnnouncement = {title: title, author:author, post_body: post_body}
    // Create a new announcement and save to DB
    Announcement.create(newAnnouncement, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to announcements page
            console.log(newlyCreated);
            res.redirect("/announcements");
        }
    });
});

//NEW - show form to create new announcement
router.get("/new", middleware.isLoggedIn, function(req, res){
    console.log("attempting get /new in announcements route");
   res.render("announcements/new"); 
});

// SHOW - shows more info about one announcement
router.get("/:id", function(req, res){
    //find the announcement with provided ID
    Announcement.findById(req.params.id).populate("comments").exec(function(err, foundAnnouncement){
        if(err){
            console.log(err);
        } else {
            console.log(foundAnnouncement)
            //render show template with that announcement
            res.render("announcements/show", {announcement: foundAnnouncement});
        }
    });
});

// EDIT announcement ROUTE
router.get("/:id/edit", middleware.checkAnnouncementOwnership, function(req, res){
    Announcement.findById(req.params.id, function(err, foundAnnouncement){
        if(err){
            console.log(err)
        } else{
            res.render("announcements/edit", {announcement: foundAnnouncement});
        } 
    });
});

// UPDATE announcement ROUTE
router.put("/:id",middleware.checkAnnouncementOwnership, function(req, res){
    // find and update the correct announcement
    Announcement.findByIdAndUpdate(req.params.id, req.body.announcement, function(err, updatedAnnouncement){
       if(err){
           res.redirect("/announcements");
       } else {
           //redirect somewhere(show page)
           res.redirect("/announcements/" + req.params.id);
       }
    });
});

// DESTROY announcement ROUTE
router.delete("/:id",middleware.checkAnnouncementOwnership, function(req, res){
   Announcement.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/announcements");
      } else {
          res.redirect("/announcements");
      }
   });
});


module.exports = router;

