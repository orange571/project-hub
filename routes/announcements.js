var express = require("express");
var router  = express.Router();
var Announcement = require("../models/announcement");
var Comment = require("../models/comment");
var User = require("../models/user");
var middleware = require("../middleware");


//INDEX - show all announcements
router.get("/", middleware.isLoggedIn, function(req, res){
    // Get all announcements from DB
    Announcement.find({}).populate("author").exec(function(err, allAnnouncements){
       if(err){
           console.log(err);
       } else {
          res.render("announcements/index",{announcements:allAnnouncements, page: 'announcements'});
          
       }
    });
});

//CREATE - add new announcement to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to announcements array
    var title = req.body.title;
    var author = req.user._id;
    var post_body = req.body.post_body;
    var newAnnouncement = {title: title, author:author, post_body: post_body}
    console.log(newAnnouncement);
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
   res.render("announcements/new", {page: "announcements"}); 
});

// SHOW - shows more info about one announcement
router.get("/:id", middleware.isLoggedIn, function(req, res){
    //find the announcement with provided ID
    Announcement.
        findById(req.params.id).
        populate("author").
        populate({path: "comments", populate: {path: "author"}}).
        exec(function(err, foundAnnouncement){
            if(err){
                console.log(err);
            } else {
                console.log("This is the announcement");
                console.log(JSON.stringify(foundAnnouncement, null, "\t"))
                //render show template with that announcement
                console.log("This is the announcement");
                res.render("announcements/show", {announcement: foundAnnouncement, page: 'announcements'});
            }
        });
});

// EDIT announcement ROUTE
router.get("/:id/edit", middleware.checkAnnouncementOwnership, function(req, res){
    Announcement.findById(req.params.id, function(err, foundAnnouncement){
        if(err){
            console.log(err)
        } else{
            res.render("announcements/edit", {announcement: foundAnnouncement, page: 'announcements'});
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
    console.log("reached delete annoucement route");
   Announcement.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/announcements");
      } else {
          res.redirect("/announcements");
      }
   });
});


module.exports = router;

