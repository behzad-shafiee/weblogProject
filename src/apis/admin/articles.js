const express = require('express');
const router = express.Router();

const controlers = require('../../controllers/controlers');
const validatores = require('../../validators/validatores');
const middlewares = require('../../middlewares/middlewares');
const tools = require('../../tools/tools');



const uploadImgArticle = tools.upload.single('imgCreatArticle');
const uploadUpdateArticle=tools.upload.single('imgUpdateArticle')
const uploadUpdateArticleInWholePage=tools.upload.single('imgWholeArticlePage')







router.get('/seeMine',controlers.showArticlesOfBlogger);
router.post('/creat', uploadImgArticle, controlers.creatNewArticle);
router.post('/seeMine/update',uploadUpdateArticle,controlers.doUpdateArticle);
router.post('/seeMine/delete',controlers.doDeleteArticle);
router.post('/seeMine/detailsOneArticle',controlers.showDetailsOneArticle);


router.get('/seeAll',controlers.showWholeArticles);
router.post('/seeAll/detailsOneArticle',controlers.showDetailsOneArticle)
router.post('/seeAll/detailsOneArticle/comment',controlers.setComment)

router.post('/seeAll/delete',controlers.doDeleteArticleOfBloggers)



module.exports = router;