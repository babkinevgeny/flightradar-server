const mongoose = require('mongoose');
const user = new mongoose.Schema({
    username: String,
    password: String,
    lastSessionEndedDate: Date,
    favorites: [
        {
            addedToFavorites: Date,
            codeName: String,
            arrivalAirport: {
                name: String,
                code: String,
                position: {
                    latitude: String,
                    longitude: String
                }
            },
            departureAirport: {
                name: String,
                code: String,
                position: {
                    latitude: String,
                    longitude: String
                }
            },
        }
    ]
});

module.exports = mongoose.model('User', user);