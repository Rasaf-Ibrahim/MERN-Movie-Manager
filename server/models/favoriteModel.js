const mongoose = require('mongoose');

const favoriteSchema = mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    imageUrl: {
        type: String,
        required: true
    },

    type: {
        type: String,
        required: true
    },

    year: {
        type: String,
        required: true
    },

    imdbID: {
        type: String,
        required: true
    }

}, { timestamps: true })


module.exports = mongoose.model('FavoriteModel', favoriteSchema)
