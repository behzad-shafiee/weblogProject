const { application } = require('express');
const express = require('express');
const router = express.Router();

const middlewares=require('../middlewares/middlewares');


const adminRoute=require('./admin/adminRoute');

const dashboardBloggerRoute=require('./blogger/dashboardBloggerRoute');
const loginRoute=require('./blogger/loginRoute');
const logoutRoute=require('./blogger/logoutRoute');
const registerRoute=require('./blogger/registerRoute');


router.use('/admin',adminRoute);

router.use('/blogger',middlewares.isLogin,dashboardBloggerRoute);
router.use('/login',loginRoute);
router.use('/logout',logoutRoute);
router.use('/register',registerRoute);



module.exports = router;