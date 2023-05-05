

const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');
// Mapbox
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken =  process.env.MAPBOX_TOKEN
const  geocoder= mbxGeocoding({accessToken:mapBoxToken});

// Index
module.exports.index = async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}

// New 
module.exports.renderNewForm = (req,res) => {
    res.render('campgrounds/new');
}

// Create

module.exports.createCampground = async (req,res,next) => {
    //if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400);
    // images extraction
    const geoData = await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
    //res.send(geoData.body.features[0].geometry.coordinates);
    //console.log(geoData.body.features[0].geometry);
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images =  req.files.map(f => ({
        url:f.path,
        filename:f.filename
    }));
    // Assigning logined in user
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success','Successfully made new campground!');
    res.redirect(`campgrounds/${campground._id}`);

}

// Show

module.exports.showCampground = async (req,res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id).populate({
        path:'reviews',
        populate: {
            path:'author'
        }
    })
    .populate('author');
    console.log(campground);
    if(!campground) {
        req.flash('error','Cannot find that campground!');
        res.redirect('/campgrounds');
    }
    //console.log(campground);
    res.render('campgrounds/show',{campground});
}

// Update

module.exports.renderEditForm = async (req,res) => {
    const {id} = req.params; // -> req.params.id also works
    const campground = await Campground.findById(id);
    if(!campground) {
        req.flash('error','Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{campground});
}

module.exports.updateCampground = async (req,res) => {
    const {id} = req.params; 
    // ...req.body.campground -> spread operator()
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    const imgs = req.files.map(f => ({
        url:f.path,
        filename:f.filename
    }));
    campground.images.push(...imgs);
    // Delete images from database (cloudinary)
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull:{images:{filename:{$in: req.body.deleteImages}}}});
    }
    await campground.save();
    req.flash('success','Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}


// Delete

module.exports.deleteCampground = async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully Deleted Campground!');
    res.redirect('/campgrounds');
}