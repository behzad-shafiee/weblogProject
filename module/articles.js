const mongoose = require('mongoose');
const timestamp = require('time-stamp');
const connection = require('./connection');

const articleSchema = new mongoose.Schema({

    "title": {
        type: String,
        required: [true, 'titleArticle must filles'],
        trim: true,

    },
    "text": {
        type: String,
        required: [true, 'textArticle must filles'],
        trim: true,
        default:null
    },
    "image": {
        type: String,
        required: [true, 'articles must have a image'],
        default:'imgArticleDefalt.jpg'
       

    },
    "writer":{
        type: String,
        required: [true, 'writer of articles must fill'],
    },

},{timestamps:true});



const Article = mongoose.model('Article', articleSchema);




module.exports = Article;