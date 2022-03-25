
const { body, validationResult } = require('express-validator');
const validator = require('validator');
const Blogger = require('../../models/blogger');
const bcrypt = require('bcrypt');

module.exports = new class {



    arrOfValidateUpdateBloggerInfo() {

        return [
            body('userName').isLength({ min: 2 }).withMessage('username must be at least 2 charcator'),
            body('password').isLength({ min: 8 }).withMessage('password must be at least 8 charcator'),
            body('firstName').isLength({ min: 2, max: 30 }).withMessage('firstname must be between 2-30'),
            body('lastName').isLength({ min: 2, max: 30 }).withMessage('lastname must be between 2-30'),
        ]
    }

    async doValidateUpdateBloggerInfo(req, res, next) {

        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                if (req.session.blogger.role === 'admin') {
                    req.params.role = 'admin';
                    return res.render('admin/dashboard', { blogger: req.session.blogger, msg: 'username must be at least 2 charcator,password must be at least 8 charcator ,firstname and lastName must be between 2-30', srcImgBlogger: req.session.blogger.avatar, role: 'admin' });
                };

                req.params.role = 'blogger';
                res.render('blogger/dashboard', { blogger: req.session.blogger, msg: 'username must be at least 2 charcator,password must be at least 8 charcator ,firstname and lastName must be between 2-30', srcImgBlogger: req.session.blogger.avatar });
            }

            const phoneNumber = req.body.phoneNumber;
            if (!validator.isMobilePhone(phoneNumber, ['fa-IR'])) {

                if (req.session.blogger.role === 'admin') {
                    req.params.role = 'admin';
                    return res.render('admin/dashboard', { blogger: req.session.blogger, msg: 'phoneNumber must be 11 digit and start with 09..', srcImgBlogger: req.session.blogger.avatar, role: 'admin' });
                };

                req.params.role = 'blogger';
                res.render('blogger/dashboard', { blogger: req.session.blogger, msg: 'phoneNumber must be 11 digit and start with 09..', srcImgBlogger: req.session.blogger.avatar });

            }

            const regExp = /^(?=[^A-Z\n]*[A-Z])(?=[^a-z\n]*[a-z])(?=[^0-9\n]*[0-9])(?=[^#?!@$%^&*\n-]*[#?!@$%^&*-]).{8,}$/g;
            const checkPass = regExp.test(req.body.password);
            if (!checkPass) {

                if (req.session.blogger.role === 'admin') {
                    req.params.role = 'admin';
                    return res.render('admin/dashboard', { blogger: req.session.blogger, msg: 'password must be atleast one capital letter one small letter one number one special letter', srcImgBlogger: req.session.blogger.avatar, role: 'admin' });
                };

                req.params.role = 'blogger';
                res.render('blogger/dashboard', { blogger: req.session.blogger, msg: 'password must be atleast one capital letter one small letter one number one special letter', srcImgBlogger: req.session.blogger.avatar });
            };

            const userName = req.body.userName;
            const isExist = await Blogger.findOne({ userName });
            if (isExist) {

                if (req.session.blogger.role === 'admin') {
                    req.params.role = 'admin';
                    return res.render('admin/dashboard', { blogger: req.session.blogger, msg: 'userName must be uniqe', srcImgBlogger: req.session.blogger.avatar, role: 'admin' });
                };

                req.params.role = 'blogger';
                res.render('blogger/dashboard', { blogger: req.session.blogger, msg: 'userName must be uniqe', srcImgBlogger: req.session.blogger.avatar });
            }

            next();

        } catch (err) {
            console.log(`err of doValidateUpdateBloggerInfo:${err}`);
        }


    }






    arrOfvalidateLogin() {

        return [
            body('userName').notEmpty().withMessage("userName is empty"),
            body('password').notEmpty().withMessage("password is empty")
        ]

    }
    doValidateLogin(req, res, next) {


        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.render('loginPage', { msg: 'userName and password must fill' });
        }

        next();


    }




    arrOfvalidateRegister() {

        return [
            body('userName').notEmpty().withMessage("userName is empty").isLength({ min: 2, max: 30 }).withMessage('username must be at least 2 charcator'),
            body('password').notEmpty().withMessage("password is empty").isLength({ min: 8, max: 15 }).withMessage('password must be at least 8 charcator'),
            body('firstName').notEmpty().withMessage("firstName is empty").isLength({ min: 2, max: 30 }).withMessage('firstname must be between 2-30'),
            body('lastName').notEmpty().withMessage("lastName is empty").isLength({ min: 2, max: 30 }).withMessage('lastname must be between 2-30'),
            body('phoneNumber').notEmpty().withMessage("phoneNumber is empty")
        ]

    }


    doValidateRegister(req, res, next) {

        console.log(req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.render('registerPage', { error: 'something is wrong!!!' });
        }

        const phoneNumber = req.body.phoneNumber;
        if (!validator.isMobilePhone(phoneNumber, ['fa-IR'])) {

            console.log(`phoneNumber must be 11 digit and start with 09..`);
            return res.render('registerPage', { error: 'something is wrong!!!' });

        }




        const regExp = /^(?=[^A-Z\n]*[A-Z])(?=[^a-z\n]*[a-z])(?=[^0-9\n]*[0-9])(?=[^#?!@$%^&*\n-]*[#?!@$%^&*-]).{8,}$/g;
        const checkPass = regExp.test(req.body.password);
        if (!checkPass) {
            console.log(req.body.password);
            console.log('password must be atleast one capital letter one small letter one number one special letter');
            return res.render('registerPage', { error: 'something is wrong!!!' });
        };



        Blogger.findOne({ userName: req.body.username })
            .then((checkIsExistUser) => {

                if (checkIsExistUser) {

                    return res.render('registerPage', { error: 'something is wrong!!!' });

                }
                next();
            })
            .catch(err => {

                console.log(`err of finding blogger in doValidateRegister:${err}`);
            })






    }

}