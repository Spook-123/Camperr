## Home Page

<a href="https://ibb.co/sQ0fd3j"><img src="https://i.ibb.co/ZKnjpTd/Home-Page.png" alt="Home-Page" border="0" /></a>

## Campgrounds

<a href="https://ibb.co/bQyNnKr"><img src="https://i.ibb.co/TYnP5gH/Campgrounds.png" alt="Campgrounds" border="0" /></a>

## Camgrounds List

<a href="https://ibb.co/3dQytcW"><img src="https://i.ibb.co/vqRx2km/List.png" alt="List" border="0" /></a>

Camperr is a website where users can create and review campgrounds. In order to review or create a campground, you must have an account.

This project was created using Node.js, Express, MongoDB, and Bootstrap. Passport.js was used to handle authentication.


## Features:-

1. Users can create, edit, and remove campgrounds

2. Users can review campgrounds once, and edit or remove their review

3. User profiles include more information on the user (full name, email, phone, join date), their campgrounds, and the option to edit their profile or delete their account

4. Search campground by name or location

5. Sort campgrounds by highest rating, most reviewed, lowest price, or highest price


## Run it locally

1. Install mongodb

2. Create a cloudinary account to get an API key and secret code

git clone https://github.com/Spook-123/Camperr/tree/master

cd Camperr

npm install

## Create a .env file (or just export manually in the terminal) in the root of the project and add the following:

DATABASEURL='<url>'

API_KEY=''<key>

API_SECRET='<secret>'

Run mongod in another terminal and node app.js in the terminal with the project.

Then go to localhost:3000.

To get google maps working check this out.
