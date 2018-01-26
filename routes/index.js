var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Hub = require("../models/hub")

//root route
router.get("/", function(req, res){
    res.render("index");
});

// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to Project Hub " + user.username);
           res.redirect("/announcements"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/announcements",
        failureRedirect: "/login",
        failureFlash:true,
        successFlash: "Welcome to Project Hub"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/");
});

//profile route
router.get("/profile", function(req, res){
    console.log("showing profile page for" + res.locals.currentUser._id + " " + res.locals.currentUser.username);
   res.render("profile"); 
});

router.put("/profile", function(req, res){
    console.log("put request to profile recieved");
    // find and update the correct campground
    User.findByIdAndUpdate(res.locals.currentUser._id,{picture: req.body.img_url}, function(err, updatedProfile){
       if(err){
           res.redirect("/profile");
       } else {
           //redirect somewhere(show page)
           res.redirect("/profile");
       }
    });
});


//locations route 
router.get("/locations", function(req, res){
    Hub.find({}, function(err, allHubs){
        if(err){
            console.log(err);
        } else {
            res.render("locations",{hubs:JSON.stringify(allHubs)});
        }
    });
});

module.exports = router;
