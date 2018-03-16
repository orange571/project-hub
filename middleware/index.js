var Announcement = require("../models/announcement");
var Comment = require("../models/comment");
var Item = require("../models/item");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkAnnouncementOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Announcement.findById(req.params.id, function(err, foundAnnouncement){
           if(err){
               req.flash("error", "Announcement not found");
               res.redirect("back");
           }  else {
               // does user own the announcement?
            if(foundAnnouncement.author.equals(req.user._id) || req.user.isAdmin) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.equals(req.user._id) || req.user.isAdmin) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}


middlewareObj.checkItemOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Item.findById(req.params.id, function(err, foundItem){
           if(err){
               req.flash("error", "Item not found");
               res.redirect("back");
           }  else {
               // does user own the announcement?
            if(foundItem.owner.equals(req.user._id) || req.user.isAdmin) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}


middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middlewareObj.isAdmin = function(req, res, next){
    if(res.locals.currentUser.isAdmin){
        return next();
    }
    req.flash("error", "You need do not have permission to do that");
    res.redirect("/login");
}


middlewareObj.isLibrarian = function(req, res, next){
    if(res.locals.currentUser.isLibrarian){
        return next();
    }
    req.flash("error", "You need do not have permission to do that");
    res.redirect("/login");
}

middlewareObj.isSafe = function(req, res, next) {
    if(req.body.image_url.match(/^https:\/\/images\.unsplash\.com\/.*/)) {
      next();
    }else {
      req.flash('error', 'Only images from images.unsplash.com allowed.');
      res.redirect('back');
    }
}

module.exports = middlewareObj;