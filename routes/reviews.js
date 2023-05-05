const express = require('express');
const router = express.Router({mergeParams:true});
// Async Errors
const catchAsync = require('../utils/catchAsync');
// reviews
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware')
const reviews = require('../controllers/reviews')




// REVIEW ROUTES
router.post('/',isLoggedIn,validateReview,catchAsync(reviews.createReview));


router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview));


module.exports = router;