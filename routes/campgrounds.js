const express = require('express');
const router = express.Router();
// Async Errors
const catchAsync = require('../utils/catchAsync');
// Campground
const Campground = require('../models/campground');
// Custom middleware,validate,isAuthor
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware');
// controllers index
const campgrounds = require('../controllers/campgrounds');
// Multer
const multer  = require('multer');
// storage
const {storage} = require('../cloudinary');
const upload = multer({storage});



router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.createCampground));


// Create
router.get('/new',isLoggedIn,campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put( isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground));





// Update  -> UPDATE purpose you need override method -> (npm i method-override)
router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm))


module.exports = router;