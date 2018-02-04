var express = require("express");
var router  = express.Router();
var Item = require("../models/item");
var User = require("../models/user");
var middleware = require("../middleware");  
var passport = require("passport");
var Transaction = require("../models/transaction")

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



router.get("/verifyuser/checkout", middleware.isLoggedIn, passport.authenticate("local", 
    {
        session: false,
        failureRedirect: "/library/verifyuser",
        failureFlash: "User is not Valid",
    }), function(req, res){
        req.flash('success', "User " + req.query.username + " was Verified");
        User.findOne({username: req.query.username}, function(err, foundUser) {
            if(err) {
                console.log(err); 
                req.flash("error", err);
                return res.redirect("/library");
            } else {
                console.log(foundUser);
                res.redirect("/library/verifyuser/" + foundUser._id);
            }
        })
        
});

router.get("/verifyuser", middleware.isLoggedIn, function(req, res) {
    res.render("library/verifyuser", {page: 'verifyuser'}); 
});

router.get("/finditem",/** middleware.isLoggedIn,**/ function(req, res) {
    console.log(req.query.itemId);
    Item.findById(req.query.itemId,function(err, foundItem){
        if (err) {
            console.log(err); 
            req.flash("error", err);
            res.send(err);
        } else {
            if(foundItem) {
                console.log("true item found")
                console.log(foundItem);
                res.send(foundItem);
            } else {
                console.log("false item found")
                console.log(foundItem);
                res.send("No item matched id");
            }
            
        }
    })
})

//SHOW CHECKOUT PAGE FOR USER
router.get("/verifyuser/:user_id",/** middleware.isLoggedIn,**/ function(req, res) {
    User.findById(req.params.user_id, function(err, foundUser){
        if(err) {
            console.log(err); 
            req.flash("error", err);
            return res.redirect("/library");
        } else {
            Item.find({}).populate("owner").exec(function(err, allItems){
               if(err){
                    console.log(err);
                    req.flash("error", err);
                    return res.redirect("/library");
               } else {
                  res.render("library/checkout",{user:foundUser, items:allItems, page: 'library'})
               }
            });
            
        }
    })
})

// ITEM CHECKOUT. CREATE TRANSACTION
router.post("/verifyuser/:user_id",/** middleware.isLoggedIn, **/function(req, res){
    console.log("You have reached the PUT verifyuser page");
    console.log(req.body);
    var checkoutItemList = req.body;
    var recieptArray = [];
    var lendeeName;
    var librarian = res.locals.currentUser._id;
    var lendee = req.params.user_id;
    var itemsProcessed = 0;
    console.log("testing create transactions route");
    checkoutItemList.forEach(function(item){
        var itemId = item.id;
        var newTransaction = {item: itemId, librarian: librarian, lendee: lendee};
        console.log("newTransaction");
        console.log(newTransaction);
        Transaction.create(newTransaction, function(err, newlyCreatedTransaction) {
           if(err){
               console.log(err);
               recieptArray.push(err);
               console.log("error 1");
               console.log(recieptArray);
           } else {
               console.log(newlyCreatedTransaction);
               User.findById(lendee, function(err, foundUser) {
                   if(err) {
                       console.log(err);
                       console.log("error 2");
                         console.log(recieptArray);
                   } else {
                       console.log("error 3");
                        console.log(recieptArray);
                       lendeeName = foundUser.username;
                       foundUser.transactions.push(newlyCreatedTransaction._id);
                       foundUser.save();
                        itemsProcessed++;
                       console.log("error 5");
                       console.log(recieptArray);
                       recieptArray.push(newlyCreatedTransaction);
                       console.log("error 6");
                       console.log(recieptArray);
                       if(itemsProcessed===checkoutItemList.length) {
                            console.log("error 7");
                            console.log(recieptArray);
                            res.redirect("/dashboard/" + lendee);
                       }  
                   }
               });
               Item.findById(itemId, function(err, foundItem) {
                    if(err) {
                       console.log(err)
                   } else {
                       console.log("error 4");
                        console.log(recieptArray);
                       foundItem.transactions.push(newlyCreatedTransaction._id);
                   }
               });
           }
        });
    });
    
})

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
