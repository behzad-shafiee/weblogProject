
const Blogger = require('../../module/blogger');
module.exports = new class {

    async checkSession(req, res, next) {
        try {

            if (req.session.blogger) {
                if (req.session.blogger.role === 'admin') {
                    const users = await Blogger.find({ role: 'blogger' });
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

        if (!req.session.blogger) {
            return res.render('loginPage', { msg: 'you must first login' })
        };
        next();
    }

}