const express = require('express');
const router = express.Router();

const controlers = require('../../contrlores/controlers');
const validatores = require('../../validatores/validatores');
const middlewares = require('../../middlewares/middlewares');
const tools=require('../../tools/tools');

const articles=require('./articles');


const uploadUpdateAvatar = tools.upload.single('updateAvatar');


//dashboardPage
router.get('/dashboard', controlers.showDashboardBlogger);

router.post('/dashboard/update', validatores.arrOfValidateUpdateBloggerInfo(), validatores.doValidateUpdateBloggerInfo, controlers.doUpdateBloggerInfo);

router.get('/dashboard/delete', controlers.doDeleteBlogger);


//articles
router.use('/dashboard/articles',articles);



//avatar
router.post('/dashboard/avatar/update', uploadUpdateAvatar, controlers.doUpdateAvatar);



module.exports = router;