
// Campground Schema,// reviews schema
const {campgroundSchema,reviewSchema} = require('./schemas.js');
// Express Error
const ExpressError = require('./utils/ExpressError.js');
// Campground
const Campground = require('./models/campground');
// Review
const Review = require('./models/review.js')

// Login
module.exports.isLoggedIn = (req,res,next) => {
    //console.log("REQ.USER...",req.user); 
    if(!req.isAuthenticated()) {
        //console.log(req.originalUrl);
        // store the url they are requesting
        //console.log(req.path,req.originalUrl);
        req.session.returnTo = req.originalUrl;
        req.flash('error','You Must be signed in first! ');
        return res.redirect('/login');
    }
    next();
}

// Validate
module.exports.validateCampground = (req,res,next) => {
    // Postman error handling
    const {error} = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}

// middleware authorization
module.exports.isAuthor = async (req,res,next) => {
    const {id} = req.params; // -> req.params.id also works
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)) {
        req.flash('error','You do not have permission to do that!!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


// MiddleWare Review
module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}


// middleware review author
module.exports.isReviewAuthor = async (req,res,next) => {
    const {id,reviewId} = req.params; // -> req.params.id also works
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)) {
        req.flash('error','You do not have permission to do that!!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


