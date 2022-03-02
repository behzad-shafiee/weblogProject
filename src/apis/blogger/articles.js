const express = require('express');
const router = express.Router();

const controlers = require('../../contrlores/controlers');
const validatores = require('../../validatores/validatores');
const middlewares = require('../../middlewares/middlewares');
const tools = require('../../tools/tools');



const uploadImgArticle = tools.upload.single('imgArticle');
const uploadUpdateArticle=tools.upload.single('UpdateArticleImg')
const uploadUpdateArticleInWholePage=tools.upload.single('imgWholeArticlePage')




router.get('/seeMine',controlers.showArticlesOfBlogger);
router.get('/seeAll',controlers.showWholeArticles);


router.post('/creat', uploadImgArticle, controlers.creatNewArticle);



router.post('/seeMine/update',uploadUpdateArticle,controlers.doUpdateInBloggerArticlePage);
router.post('/seeAll/update',uploadUpdateArticleInWholePage,controlers.doUpdateInWholeArticlePage);



router.post('/seeMine/delete',controlers.doDeleteInBloggerArticlePage);
router.post('/seeAll/delete',controlers.doDeleteInWholeArticlePage);


router.post('/seeMine/detailsOneArticle',controlers.showDetailsOneArticle)
router.post('/seeAll/detailsOneArticle',controlers.showDetailsOneArticleInWholePageArticle)


module.exports = router;