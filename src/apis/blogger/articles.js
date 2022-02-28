const express = require('express');
const router = express.Router();

const controlers = require('../../contrlores/controlers');
const validatores = require('../../validatores/validatores');
const middlewares = require('../../middlewares/middlewares');
const tools = require('../../tools/tools');



const uploadImgArticle = tools.upload.single('imgArticle');
const uploadUpdateArticle=tools.upload.single('UpdateArticleImg')
const uploadUpdateArticleInWholePage=tools.upload.single('imgWholeArticlePage')

//articles
router.get('/seeMine',controlers.showArticlesOfBlogger);

router.get('/seeAll',controlers.showWholeArticles);


router.post('/creat', uploadImgArticle, controlers.creatNewArticle);


router.post('/seeMine/update',uploadUpdateArticle,controlers.doUpdateInBloggerArticlePage)


router.post('/seeAll/update',uploadUpdateArticleInWholePage,controlers.doUpdateInWholeArticlePage)





module.exports = router;