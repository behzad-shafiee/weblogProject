const express = require('express');
const router = express.Router();

const controlers = require('../../controllers/controllers');
const validatores = require('../../validators/validatores');
const middlewares = require('../../middlewares/middlewares');
const tools=require('../../tools/tools');

const articles=require('./articles');


const uploadUpdateAvatar = tools.upload.single('updateAvatar');


//dashboardPage
router.get('/', controlers.showDashboard);

router.post('/update', validatores.arrOfValidateUpdateBloggerInfo(), validatores.doValidateUpdateBloggerInfo, controlers.doUpdateUserInfo);

router.post('/delete', controlers.doDeleteUser);


//articles
router.use('/articles',articles);



//avatar
router.post('/avatar/update', uploadUpdateAvatar, controlers.doUpdateAvatar);



module.exports = router;