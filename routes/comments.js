var express = require("express");
var router  = express.Router({mergeParams: true});
var Announcement = require("../models/announcement");
var Comment = require("../models/comment");
var User = require("../models/user")
var middleware = require("../middleware");

//Comments New
router.get("/new",middleware.isLoggedIn, function(req, res){
    // find announcement by id
    Announcement.findById(req.params.id, function(err, announcement){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {announcement: announcement, page: 'annoucements'});
        }
    })
});

//Comments Create
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup announcement using ID
   //Announcement.findById(req.params.id).populate("comments").exec(function(err, foundAnnouncement){
   Announcement.findById(req.params.id, function(err, announcement){
       if(err){
           console.log(err);
           res.redirect("/announcements");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error", "Something went wrong");
               console.log(err);
           } else {
               //add username and id to comment
               comment.author = req.user._id;
               //save comment
               comment.save();
               announcement.comments.push(comment._id);
               //announcement.comments.push(comment);
               announcement.save();
               console.log(comment);
               req.flash("success", "Successfully added comment");
               res.redirect('/announcements/' + announcement._id);
               console.log("This is the end of the post comment route")
           }
        });
       }
   });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        Announcement.findById(req.params.id, function(err, foundAnnoucement){
            if(err){
                res.redirect("back");
            } else {
                res.render("comments/edit", {announcement_id: req.params.id, comment: foundComment, announcement: foundAnnoucement, page: 'annoucements'})
            } 
        })  
      }
   });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    console.log("reached comment update route");
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/announcements/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           console.log("error finding/removing comment");
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           console.log("removed comment");
           res.redirect("/announcements/" + req.params.id);
       }
    });
});

module.exports = router;