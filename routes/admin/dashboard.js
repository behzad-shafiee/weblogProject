const express = require('express');
const router = express.Router();

const controlers = require('../../controllers/controllers');
const middlewares = require('../../middlewares/middlewares');
const validatores = require('../../validators/validatores');
const tools = require('../../tools/tools');


const articles = require('./articles');
const uploadUpdateAvatar = tools.upload.single('updateAvatar');

router.get('/', controlers.showDashboard);
router.post('/delete', controlers.doDeleteUser);
router.post('/update', validatores.arrOfValidateUpdateBloggerInfo(), validatores.doValidateUpdateBloggerInfo, controlers.doUpdateUserInfo);
//articles
router.use('/articles', articles);


router.get('/seeBloggers', controlers.showBloggers);
router.get('/seeComments', controlers.showComments);
router.post('/seeComments/delete', controlers.doDeleteComment);
router.post('/seeBloggers/changePassBlogger', controlers.doChangePassBlogger);
router.post('/seeBloggers/deleteBlogger', controlers.doDeleteBlogger);

router.post('/avatar/update', uploadUpdateAvatar, controlers.doUpdateAvatar);

module.exports = router;