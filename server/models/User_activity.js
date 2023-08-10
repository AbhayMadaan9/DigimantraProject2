const mongoose = require('mongoose')
const { Schema } = mongoose;

const User_activity_Schema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    last_login: {
        type: Date,
        required: true,
    },
    last_logout: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },

})

module.exports = mongoose.model('User_activity', User_activity_Schema)