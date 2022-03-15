const mongoose = require('mongoose');
const timestamp = require('time-stamp');
const connection = require('./connection');
const Article=require('./articles');

const commentSchema = new mongoose.Schema({

    "writer": {
        type: String,
        required: [true, 'writer must filles'],
        trim: true,

    },
    "text": {

        type: String,
        required: [true, 'textComment must filles'],
        trim: true,
    },
    'idArticle': {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Article',
        required:[true, 'idArticle must filles']
    }

}, { timestamps: true });



const Comment = mongoose.model('Comment', commentSchema);




module.exports = Comment;