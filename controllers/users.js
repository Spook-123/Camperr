
const User = require('../models/user');


// User
module.exports.renderRegister = (req,res) => {
    res.render('users/register');
}


// Sign up
module.exports.register = async(req,res,next) => {
    try {
        const {email,username,password} = req.body;
        const user = new User({email,username});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser,err => {
            if(err) {
                return next(err);
            }
            else {
                req.flash('success',"Welcome to Camperr!");
                res.redirect('/campgrounds');
            }
        });
    }
    catch(e) {
        req.flash('error',e.message);
        res.redirect('/register');
    }
    //console.log(registeredUser);

    
}


module.exports.renderLogin = (req,res) => {
    res.render('users/login');
}


// login in flash
module.exports.login = (req,res) => {
    req.flash('success','Welcome Back!');
    // stored previous session
    const redirectUrl = req.session.returnTo || 'campgrounds';
    // delete stored session
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

// Logout
module.exports.logout = (req,res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success','Goodbye!');
        res.redirect('/campgrounds');
      });
    
}