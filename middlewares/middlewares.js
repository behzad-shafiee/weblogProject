
const User = require('../models/user');

module.exports = new class {

    async checkSession(req, res, next) {
        try {

            if (req.session.user) {
                if (req.session.user.role === 'admin') {
                    const users = await User.find({ role: 'blogger' });
                    res.render('adminDashboard', { users });
                    return
                };

                res.redirect('/blogger/dashboard');
                return
            };
            next();

        } catch (err) {

            console.log(`err of checkSession:${err}`);
        }

    };

    isLogin(req, res, next) {

        if (!req.session.user) {
            return res.render('loginPage', { msg: 'you must first login' })
        };
        next();
    }


    async checkIsAdmin(req, res, next) {

        const user = await User.findOne({role:req.session.user.role});
        req.params.role='amin'
        if (!user) {
            return res.render('loginPage', { msg: 'access dinied' });
        };

        next();
    }

}