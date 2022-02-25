const express = require('express');
const router = express.Router();

const controlers = require('../../contrlores/controlers');
const validatores = require('../../validatores/validatores');
const middlewares = require('../../middlewares/middlewares');
const tools = require('../../tools/tools');



const uploadImgArticle = tools.upload.single('imgArticle');
const uploadUpdateArticle=tools.upload.single('UpdateArticleImg')


//articles
router.get('/seeMine',controlers.showArticlesOfBlogger);

router.get('/seeAll',controlers.showWholeArticles);


router.post('/creat', uploadImgArticle, controlers.creatNewArticle);


router.post('/update',uploadUpdateArticle,controlers.doUpdateArticle)






module.exports = router;