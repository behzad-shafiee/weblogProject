const express = require('express');
const router = express.Router();

const controlers = require('../../controllers/controllers');
const validatores = require('../../validators/validatores');
const middlewares = require('../../middlewares/middlewares');
const tools = require('../../tools/tools');



const uploadImgArticle = tools.upload.single('imgCreatArticle');
const uploadUpdateArticle=tools.upload.single('imgUpdateArticle')








router.get('/seeMine',controlers.showMyArticles);
router.post('/creat', uploadImgArticle, controlers.creatNewArticle);
router.post('/seeMine/update',uploadUpdateArticle,controlers.doUpdateArticle);
router.post('/seeMine/delete',controlers.doDeleteArticle);
router.post('/seeMine/detailsOneArticle',controlers.seeMoreArticle);


router.get('/seeAll',controlers.showAllArticles);
router.post('/seeAll/detailsOneArticle',controlers.seeMoreArticle)
router.post('/seeAll/detailsOneArticle/comment',controlers.setComment)

router.post('/seeAll/delete',controlers.doDeleteArticleOfBloggers)



module.exports = router;