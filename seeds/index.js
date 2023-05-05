// Database
const mongoose = require("mongoose");
// Import Array
const cities = require("./cities");
// Schema imported
const Campground = require("../models/campground");
// places
const { places, descriptors } = require("./seedHelpers");

// Connection
mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
// Connection Confirmation
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
  console.log("Database Connected!");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      // YOUR USER ID
      author: "643a7c57d4829077fcb87243",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error placeat facere sunt ut corrupti commodi earum eligendi quisquam amet temporibus. Fugiat et necessitatibus qui sequi aliquid debitis cupiditate dolorem explicabo.",
      price,
      geometry: {
        type:"Point",
        coordinates:[
          cities[random1000].longitude,
          cities[random1000].latitude
      ]
      },
      images: [
        {
          url: "https://res.cloudinary.com/dhkwphjgs/image/upload/v1681908465/Camperr/dqjcbyvex9hoowdvmuci.jpg",
          filename: "Camperr/dqjcbyvex9hoowdvmuci",
        },
        {
          url: "https://res.cloudinary.com/dhkwphjgs/image/upload/v1681908466/Camperr/xcq2mwghisj30h3qxd2f.jpg",
          filename: "Camperr/xcq2mwghisj30h3qxd2f",
        },
        {
          url: "https://res.cloudinary.com/dhkwphjgs/image/upload/v1681908467/Camperr/jygeaecdjw5ma1y0t6wx.jpg",
          filename: "Camperr/jygeaecdjw5ma1y0t6wx",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
