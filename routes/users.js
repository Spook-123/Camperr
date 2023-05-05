const express = require('express');
router = express.Router()
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');



//Register
router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));



// lOgin
router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login',keepSessionInfo:true}),users.login);


// logout
router.get('/logout',users.logout)


module.exports = router;
