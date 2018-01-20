var express = require("express");
var router  = express.Router({mergeParams: true});
var annoucement = require("../models/annoucement");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new",middleware.isLoggedIn, function(req, res){
    // find annoucement by id
    console.log(req.params.id);
    annoucement.findById(req.params.id, function(err, annoucement){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {annoucement: annoucement});
        }
    })
});

//Comments Create
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup annoucement using ID
   annoucement.findById(req.params.id, function(err, annoucement){
       if(err){
           console.log(err);
           res.redirect("/annoucements");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error", "Something went wrong");
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               annoucement.comments.push(comment);
               annoucement.save();
               console.log(comment);
               req.flash("success", "Successfully added comment");
               res.redirect('/annoucements/' + annoucement._id);
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
        res.render("comments/edit", {annoucement_id: req.params.id, comment: foundComment});
      }
   });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/annoucements/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/annoucements/" + req.params.id);
       }
    });
});

module.exports = router;