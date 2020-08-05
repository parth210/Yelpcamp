var express       = require("express");
var router        = express.Router();
var campground    = require("../models/campground");
var comment       = require("../models/comment");
var middleware    = require("../middleware");


router.get("/campgrounds", function(req, res){
	
	campground.find({}, function(err, allCampgrounds) {
		if(err) {
			console.log(err);
		} else {
			res.render("campground/index", {campgrounds: allCampgrounds});
		}
	});
	
});
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, image: image, description: desc, author: author}
	campground.create(newCampground , function(err, newlyCreated){
		if(err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
	
});

router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
	res.render("campground/new");
});

//show - detailed campground info
router.get("/campgrounds/:id", function(req, res){
	campground.findById(req.params.id).populate("comments").exec(function(err , foundCampground) {
		if(err) {
			console.log(err);
		} else {
			res.render("campground/show", {campground: foundCampground});
		}
	});
});

router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
	campground.findById(req.params.id, function(err, foundCampground) {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.render("campground/edit" , {campground: foundCampground})
		}
	});
});

router.put("/campgrounds/:id", middleware.checkCampgroundOwnership,  function(req, res) {
	campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete("/campgrounds/:id",async(req, res) => {
  try {
    let foundCampground = await campground.findById(req.params.id);
    await foundCampground.remove();
    res.redirect("/campgrounds");
  } catch (error) {
    console.log(error.message);
    res.redirect("/campgrounds");
  }
});

module.exports = router;