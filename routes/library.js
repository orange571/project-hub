var express = require("express");
var router  = express.Router();
var Item = require("../models/item");
var User = require("../models/user");
var middleware = require("../middleware");  
var passport = require("passport");

//INDEX - SHOW ALL ITEMS IN LIBRARY
router.get("/", middleware.isLoggedIn, function(req, res){
    console.log("showing library page for" + res.locals.currentUser._id + " " + res.locals.currentUser.username);
    Item.find({}).populate("owner").exec(function(err, allItems){
       if(err){
           console.log(err);
       } else {
          res.render("library/index",{items:allItems, page: 'library'});
          
       }
    });
});


//CREATE - add new item to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to announcements array
    var name = req.body.name;
    var owner = req.user._id;
    var description = req.body.description;
    var isAvailable;
    if(req.body.isAvailable === 'on'){
        isAvailable = true;
    } else {
        isAvailable = false;
    }
    //Check for leading or trailing whitespace
    description = description.replace(/^\s+/, '').replace(/\s+$/, '');
    name = name.replace(/^\s+/, '').replace(/\s+$/, '');
    if (name === '' || description === '') {
        console.log("text was all whitespace");
        req.flash("error", "Field(s) was empty or only contained white space.");
        return res.redirect("/library/new");
    } 
    var newItem = {name: name, owner:owner, description: description, isAvailable: isAvailable}
    console.log(newItem);
    // Create a new announcement and save to DB
    Item.create(newItem, function(err, newlyCreatedItem){
        if(err){
            console.log(err);
        } else {
            //redirect back to announcements page
            console.log(newlyCreatedItem);
            res.redirect("/library");
        }
    });
});

//NEW - show form to create new item
router.get("/new", middleware.isLoggedIn, function(req, res){
    console.log("attempting get /new in library route");
   res.render("library/new", {page: "library"}); 
}) 

router.get("/verifyuser", middleware.isLoggedIn, function(req, res) {
    res.render("library/verifyuser", {page: 'verifyuser'}); 
});

router.post("/verifyuser", middleware.isLoggedIn, passport.authenticate("local", 
    {
        session: false,
        failureRedirect: "/library/verifyUser",
        failureFlash: "User is not Valid",
    }), function(req, res){
        req.flash('success', "User " + req.body.username + " was Verified");
        res.redirect("/library");
});

// SHOW - shows more info about one item
router.get("/:id", middleware.isLoggedIn, function(req, res){
    console.log("reached library/:id route")
    //find the item with provided ID
    Item.
        findById(req.params.id).
        populate("owner").
        exec(function(err, foundItem){
            if(err){
                console.log(err);
            } else {
                console.log("This is the item");
                console.log(JSON.stringify(foundItem, null, "\t"))
                //render show template with that item
                console.log("This is the item");
                res.render("library/show", {item: foundItem, page: 'library'});
            }
        });
});


// EDIT item ROUTE
router.get("/:id/edit", middleware.checkItemOwnership, function(req, res){
    Item.findById(req.params.id, function(err, foundItem){
        if(err){
            console.log(err)
        } else{
            res.render("library/edit", {item: foundItem, page: 'library'});
        } 
    });
});

// UPDATE item ROUTE
router.put("/:id",middleware.checkItemOwnership, function(req, res){
    //Check for leading or trailing whitespace
    var name = req.body.name;
    var description = req.body.description;
    var isAvailable;
    if(req.body.isAvailable === 'on'){
        isAvailable = true;
    } else {
        isAvailable = false;
    }
    //Check for leading or trailing whitespace
    description = description.replace(/^\s+/, '').replace(/\s+$/, '');
    name = name.replace(/^\s+/, '').replace(/\s+$/, '');
    if (name === '' || description === '') {
        console.log("text was all whitespace");
        req.flash("error", "Field(s) was empty or only contained white space.");
        return res.redirect("back");
    } 
    var editItem = {name: name, description: description, isAvailable: isAvailable}
    // find and update the correct item
    Item.findByIdAndUpdate(req.params.id, editItem, function(err, updatedItem){
       if(err){
           res.redirect("/library");
       } else {
           //redirect somewhere(show page)
           res.redirect("/library/" + req.params.id);
       }
    });
});

// Item DESTROY ROUTE
router.delete(":id", middleware.checkItemOwnership, function(req, res){
    //findByIdAndRemove
    Item.findByIdAndRemove(req.params.id, function(err){
       if(err){
           console.log("error finding/removing item");
           res.redirect("back");
       } else {
           req.flash("success", "Item deleted");
           console.log("removed Item");
           res.redirect("/library");
       }
    });
});



module.exports = router;
