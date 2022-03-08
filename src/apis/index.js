const express = require('express');
const router = express.Router();

const middlewares=require('../middlewares/middlewares');
const controlers = require('../contrlores/controlers');



const dashboardAdmin=require('./admin/dashboard');

const dashboardBloggerRoute=require('./blogger/dashboardBloggerRoute');
const loginRoute=require('./blogger/loginRoute');
const logoutRoute=require('./blogger/logoutRoute');
const registerRoute=require('./blogger/registerRoute');




router.use('/admin/dashboard',middlewares.isLogin,middlewares.checkIsAdmin,dashboardAdmin);

router.use('/blogger/dashboard',middlewares.isLogin,dashboardBloggerRoute);

router.get('/:role/dashboard',controlers.backDashboar)

router.use('/login',loginRoute);
router.use('/logout',logoutRoute);
router.use('/register',registerRoute);



module.exports = router;