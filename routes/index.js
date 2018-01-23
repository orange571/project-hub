var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

//root route
router.get("/", function(req, res){
    res.render("index");
});

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

router.get("/profile", function(req, res){
    console.log("showing profile page for" + res.locals.currentUser._id + " " + res.locals.currentUser.username);
   console.log("picture is " + res.locals.currentUser.picture);
   res.render("profile"); 
});

router.put("/profile", function(req, res){
    console.log("put request to profile recieved");
    console.log("new picture res.body.img_url");
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


//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to Project Hub " + user.username);
           res.redirect("/"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/profile",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/");
});



module.exports = router;