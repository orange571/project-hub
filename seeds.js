var mongoose = require("mongoose");
var Hub = require("./models/hub");

var data = [
    {
        name: "Mill Valley Neighborhood Center", 
        image: "images/red-brick.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        email: "millvalleync@projecthub.org",
        phoneNumber: "111-111-1111",
        location: "345 Mill Valley Road",
        lat: 38.093794,
        lng: -119.739362,
        
    },
    {
        name: "Ocean View Community Space", 
        image: "images/white-house.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        email: "oceanviewcs@projecthub.org",
        phoneNumber: "222-222-2222",
        location: "222 Ocean View Blvd",
        lat: 37.387885,
        lng: -120.029037,
    },
    {
        name: "Canyon Floor Community Center", 
        image: "images/triangle-roof.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        email: "canyonfloorcc@projecthub.org",
        phoneNumber: "333-333-3333",
        location: "333 Canyon Floor Street",
        lat: 38.7195262,
        lng: -118.3917157,
    },
    {
        name: "Pine Hill Hub", 
        image: "images/snow-cabin.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        email: "pinehillhub@projecthub.org",
        phoneNumber: "444-444-4444",
        location: "444 Pine Hill Street",
        lat: 40.093794,
        lng: -115.739362,
    }
]

function seedDB(){
   //Remove all campgrounds
   Hub.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed hub locations!");
         //add a few campgrounds
        data.forEach(function(seed){
            Hub.create(seed, function(err, hub){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a hub");
                }
            });
        });
    }); 
}

module.exports = seedDB;
