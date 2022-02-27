const mongoose = require('mongoose');
const bloggerData = require('../data/bloggerData.json');
const timestamp = require('time-stamp');
const connection = require('./connection');

const bloggerSchema = new mongoose.Schema({

    "firstName": {
        type: String,
        required: [true, 'firstName must filles'],
        trim: true,
        minlength: [3, 'firstName atleast is 3 character'],
        maxlength: [15, 'firstName maximum is 15 character']

    },
    "lastName": {
        type: String,
        required: [true, 'lastName must filles'],
        trim: true,
        minlength: [3, 'lastName atleast is 3 character'],
        maxlength: [15, 'lastName maximum is 15 character']
    },
    "userName": {
        type: String,
        required: [true, 'lastName must filles'],
        trim: true,
        minlength: [3, 'lastName atleast is 3 character'],
        maxlength: [20, 'lastName maximum is 15 character'],
        unique: [true, 'this userName already existed']

    },
    "password": {
        type: String,
        required: [true, 'password must filles'],
        trim: true,
        max: [20, 'password maximum is 8 character'],

    },
    "gender": {
        type: String,
        enum: {
            values: ['female', 'male']
        },
        default: 'female'
    },
    "avatar": {
        type: String,
        default:"avatarDefault.png"
    },
    "phoneNumber": {
        type: Number,
        required: true,
        trim: true,
    },
    "role": {
        type: String,
        enum: {
            values: ['admin', 'blogger']
        },
        default: 'blogger'
    }
});

// bloggerSchema.plugin('timestamp');

const Blogger = mongoose.model('Blogger', bloggerSchema);




module.exports = Blogger;