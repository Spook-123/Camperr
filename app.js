// .env
if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
// ejs-mate -> engines
const ejsMate = require('ejs-mate');
// Database
const mongoose = require('mongoose');
const path = require('path');
// Session
const session = require('express-session');
// Connect Flash
const flash = require('connect-flash');
// Passport
const passport = require('passport');
// local Passport
const LocalStrategy = require('passport-local');
// User Model
const User =  require('./models/user')
// random query string is discarded npm i express-mongoose-sanitize
const mongoSanitize = require('express-mongo-sanitize');
// Helmet
const helmet = require('helmet');
// MongoDbStore
const MongoDBStore = require('connect-mongo')(session);





// Method Override for Updating data
const methodOverride = require('method-override');
// Express Errors
const ExpressError = require('./utils/ExpressError');
// import campgrounds route
const campgroundRoutes = require('./routes/campgrounds');
// import reviews route
const reviewRoutes = require('./routes/reviews');
// import users routes
const userRoutes = require('./routes/users');
// Mongo atlas
//const dbUrl = process.env.DB_URL;

// Local database
const dbUrl = 'mongodb://127.0.0.1:27017/yelp-camp';


// Connection
mongoose.connect(dbUrl);
// Connection Confirmation
const db = mongoose.connection;
db.on('error',console.error.bind(console,"Connection Error:"));
db.once('open',() => {
    console.log("Database Connected!");
});


app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));



// Parse the body while getting response back of post request
app.use(express.urlencoded({extended:true}));
// Method override -> update purpose
app.use(methodOverride('_method'));
// public directory
app.use(express.static(path.join(__dirname,'public')));
// Random mongo-sanitize
app.use(mongoSanitize({
    replaceWith:'-'
}));

// mongo session store
const store = new MongoDBStore({
    url:dbUrl,
    secret:'thisshouldbeabettersecret',
    touchAfter: 24*60*60 
});

store.on("error",function(e) {
    console.log("SESSION STORE ERROR",e);
});

const sessionConfig = {
    store,
    name:'session',
    secret:'thisshouldbeabettersecret!',
    resave:false,
    saveUnintialized:true,
    cookie: {
        httpOnly:true,
        // secure:true,
        expires:Date.now() + 1000 * 60 * 60 * 24*7,
        maxAge: 1000 * 60 * 60 * 24
    }
}
// Session
app.use(session(sessionConfig));
app.use(flash());
//Helmet
app.use(helmet());
// Content Security Policy
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dhkwphjgs/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
// Passport initilize
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Middleware success flash
app.use((req,res,next) => {
    
    console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');

    next();

})

// Fake User
app.get('/fakeUser',async (req,res) => {
    const user = new User({email:'sumeet@gmail.com',username:'Sumeet'});
    const newUser = await User.register(user,'chicken');
    res.send(newUser)
});
// users routes
app.use('/',userRoutes);
// campgrounds routers
app.use('/campgrounds',campgroundRoutes);
// reviews routers
app.use('/campgrounds/:id/reviews',reviewRoutes);


// Read
app.get('/',(req,res) => {
    res.render('home');

});



// // Inserted Data
// app.get('/makecampground',async (req,res) => {
//     const camp = new Campground({title:'My Backyard',description:'Cheap Camping'});
//     await camp.save();
//     res.send(camp);
// })

// Middleware Custom Error Handling  
app.all('*',(req,res,next) => {
    next(new ExpressError('Page Not Found',404));
})

// MiddleWare error handling
app.use((err,req,res,next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Something Went Wrong!'
    res.status(statusCode).render('error',{err});
})




app.listen(3000,() => {
    console.log('Serving on port 3000!');
})