var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
	flash          = require("connect-flash"),
	passport       = require("passport"),
    localStrategy  = require("passport-local"),
	methodOverride = require("method-override"),
    campground     = require("./models/campground"),
	User           = require("./models/user"),
	seedDb         = require("./seeds"),
    comment        = require("./models/comment");

var campgroundRoutes = require("./routes/campground"),
	commentRoutes    = require("./routes/comment"),
	indexRoutes      = require("./routes/index");


mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());
// seedDb();

//passport

app.use(require("express-session")({
	secret: "I am not be found",
	resave: false,
	saveUninitialized: false
	}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error       = req.flash("error");
	res.locals.success     = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);


  /* campground.create(
	{
	name: "Salmon Creek",
	image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
	description: "huge salmon creek, beware!! it's a jail. you will get no water, no electricity, no bathroom, no networks, yes, FUCK OFF!!!!!!"
	} , function(err, campground){
		if(err){
			console.log("error");
		}
		else {
			console.log("new campground created: " + campground);
		}
}); 
*/

app.listen(3000, function() { 
  console.log('yelpcamp app has started on port 3000'); 
});