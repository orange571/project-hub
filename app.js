var express     = require("express"),
    app         = express(),
    dotenv      = require('dotenv').config(),//environment variables
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Announcement  = require("./models/announcement"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    Hub         = require("./models/hub"),
    seedDB      = require("./seeds"),
    shortid     = require("shortid");
  
//requiring routes
var commentRoutes    = require("./routes/comments"),
    announcementRoutes = require("./routes/announcements"),
    indexRoutes      = require("./routes/index"),
    libraryRoutes       = require("./routes/library")
 
var url = process.env.DATABASEURL || "mongodb://localhost/project_hub_v1";
mongoose.connect(url);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); // this is used for parsing the JSON object from POST
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
seedDB(); //seed the database

//require moment
//app.locals.moment = require('moment');
app.locals.moment = require('moment-timezone');

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/announcements", announcementRoutes);
app.use("/announcements/:id/comments", commentRoutes);
app.use("/library", libraryRoutes);


app.get('*', function(req, res){
  res.render("404");
});



app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Project Hub Server Has Started!");
});
