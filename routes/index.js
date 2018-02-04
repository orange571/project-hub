var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Hub = require("../models/hub");
var middleware = require("../middleware");
var Item = require("../models/item");

//multer and cloudinary
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files ending with jpg,jpeg,png, or gif are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dgrtym1uj', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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
            return res.redirect("/register");
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
        successRedirect: "/library",
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
router.get("/profile", middleware.isLoggedIn, function(req, res){
    console.log("showing profile page for" + res.locals.currentUser._id + " " + res.locals.currentUser.username);
   res.render("profile", {page: 'profile'}); 
});

router.put("/profile_url", middleware.isLoggedIn, middleware.isSafe, function(req, res){
    console.log("put request to profile recieved");
    // find and update the correct user
    User.findByIdAndUpdate(res.locals.currentUser._id,{picture: req.body.img_url}, function(err, updatedProfile){
       if(err){
           res.redirect("/profile");
       } else {
           //redirect somewhere(show page)
           res.redirect("/profile");
       }
    });
});

router.put("/profile_upload", middleware.isLoggedIn, upload.single('image'), function(req, res){
    console.log("put request to profile recieved");
    cloudinary.uploader.upload(req.file.path, function(result) {
      // add cloudinary url for the image to the user object under image property
      req.body.image = result.secure_url;
      User.findByIdAndUpdate(res.locals.currentUser._id,{picture: req.body.image}, function(err, updatedProfile) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('/profile');
        }
        res.redirect('/profile');
      });
    });
});





router.put("/admin", middleware.isLoggedIn, function(req, res){
    console.log("put request to admin recieved");
    if (req.body.adminCode === process.env.DB_ADMINCODE) {
        User.findByIdAndUpdate(res.locals.currentUser._id,{isAdmin: true}, function(err, updatedProfile){
           if(err){
               req.flash('error', err.message);
               res.redirect("/profile");
           } else {
               res.redirect("/profile");
           }
        });
    }

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

//calendar route
router.get("/calendar", middleware.isLoggedIn, function(req, res){
    console.log("showing calendar page for" + res.locals.currentUser._id + " " + res.locals.currentUser.username);
   res.render("calendar", {page: 'calendar'}); 
});

//dashboard route



router.get("/dashboard/:id", middleware.isLoggedIn, function(req, res){
    console.log("showing dashboard page for" + res.locals.currentUser._id + " " + res.locals.currentUser.username);
   User.
    findById(req.params.id).
    populate({path:"transactions", populate:{path:"item"}}).
    exec(function(err, foundUser){
        if(err){
                console.log(err);
            } else {
                console.log("This is the User");
                console.log(JSON.stringify(foundUser, null, "\t"))
                //render show template with that announcement
                console.log("This is the User");
                res.render("dashboard", {user: foundUser, page: 'dashboard'});
            }
    });
   res.render("dashboard", {page: 'dashboard'}); 
});

router.get("/dashboard", middleware.isLoggedIn, function(req, res){
    console.log("showing dashboard page for" + res.locals.currentUser._id + " " + res.locals.currentUser.username);
   
   
   res.render("dashboard", {page: 'dashboard'}); 
});

//location details route
router.get("/info", middleware.isLoggedIn, function(req, res){
    console.log("showing location_details page for" + res.locals.currentUser._id + " " + res.locals.currentUser.username);
   res.render("location_details", {page: 'location_details'}); 
});



module.exports = router;
