const mongoose = require('mongoose')
const { Schema } = mongoose;

const UserSchema = new Schema({
    fullname: {
        type: Object,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    phonenumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    startdate: {
        type: Date, 
        required: true
    },
    admin: {
        type: Boolean
    }

})

module.exports = mongoose.model('User', UserSchema)