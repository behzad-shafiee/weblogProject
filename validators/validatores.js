
const { body, validationResult } = require('express-validator');
const validator = require('validator');
const User = require('../models/user');
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
                if (req.session.user.role === 'admin') {
                    req.params.role = 'admin';
                    return res.render('admin/dashboard', { blogger: req.session.user, msg: 'username must be at least 2 charcator,password must be at least 8 charcator ,firstname and lastName must be between 2-30', srcImgBlogger: req.session.user.avatar, role: 'admin' });
                };

                req.params.role = 'blogger';
                res.render('blogger/dashboard', { blogger: req.session.user, msg: 'username must be at least 2 charcator,password must be at least 8 charcator ,firstname and lastName must be between 2-30', srcImgBlogger: req.session.user.avatar });
            }

            const phoneNumber = req.body.phoneNumber;
            if (!validator.isMobilePhone(phoneNumber, ['fa-IR'])) {

                if (req.session.user.role === 'admin') {
                    req.params.role = 'admin';
                    return res.render('admin/dashboard', { blogger: req.session.user, msg: 'phoneNumber must be 11 digit and start with 09..', srcImgBlogger: req.session.user.avatar, role: 'admin' });
                };

                req.params.role = 'blogger';
                res.render('blogger/dashboard', { blogger: req.session.user, msg: 'phoneNumber must be 11 digit and start with 09..', srcImgBlogger: req.session.user.avatar });

            }

            const regExp = /^(?=[^A-Z\n]*[A-Z])(?=[^a-z\n]*[a-z])(?=[^0-9\n]*[0-9])(?=[^#?!@$%^&*\n-]*[#?!@$%^&*-]).{8,}$/g;
            const checkPass = regExp.test(req.body.password);
            if (!checkPass) {

                if (req.session.user.role === 'admin') {
                    req.params.role = 'admin';
                    return res.render('admin/dashboard', { blogger: req.session.user, msg: 'password must be atleast one capital letter one small letter one number one special letter', srcImgBlogger: req.session.user.avatar, role: 'admin' });
                };

                req.params.role = 'blogger';
                res.render('blogger/dashboard', { blogger: req.session.user, msg: 'password must be atleast one capital letter one small letter one number one special letter', srcImgBlogger: req.session.user.avatar });
            };

            const userName = req.body.userName;
            const isExist = await User.findOne({ userName });
            if (isExist) {

                if (req.session.user.role === 'admin') {
                    req.params.role = 'admin';
                    return res.render('admin/dashboard', { blogger: req.session.user, msg: 'userName must be uniqe', srcImgBlogger: req.session.user.avatar, role: 'admin' });
                };

                req.params.role = 'blogger';
                res.render('blogger/dashboard', { blogger: req.session.user, msg: 'userName must be uniqe', srcImgBlogger: req.session.user.avatar });
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
            body('userName').notEmpty().withMessage("userName is empty").isLength({ min: 2, max: 30 }).withMessage('username must be between 2-30'),
            body('password').notEmpty().withMessage("password is empty").isLength({ min: 8, max: 15 }).withMessage('password must be between 8-15'),
            body('firstName').notEmpty().withMessage("firstName is empty").isLength({ min: 2, max: 30 }).withMessage('firstname must be between 2-30'),
            body('lastName').notEmpty().withMessage("lastName is empty").isLength({ min: 2, max: 30 }).withMessage('lastname must be between 2-30'),
            body('phoneNumber').notEmpty().withMessage("phoneNumber is empty")
        ]

    }


    async doValidateRegister(req, res, next) {
        try {

            const errors = validationResult(req);
            console.log(errors);
            if (!errors.isEmpty()) {

                return res.render('registerPage', { error: 'all fields must fill and userName,firstName,lastName must be between 2-30 and password must be between 8-15' });
            }

            const phoneNumber = req.body.phoneNumber;
            if (!validator.isMobilePhone(phoneNumber, ['fa-IR'])) {

                return res.render('registerPage', { error: 'phoneNumber must be 11 digit and start with 09..' });

            };

            const regExp = /^(?=[^A-Z\n]*[A-Z])(?=[^a-z\n]*[a-z])(?=[^0-9\n]*[0-9])(?=[^#?!@$%^&*\n-]*[#?!@$%^&*-]).{8,}$/g;
            const checkPass = regExp.test(req.body.password);
            if (!checkPass) {

                return res.render('registerPage', { error: 'password must be atleast one capital letter one small letter one number one special letter' });
            };

            const isExist = await User.findOne({ userName: req.body.userName });
            if (isExist) {

                return res.render('registerPage', { error: 'userName must be uniqe' });

            }
            next();

        } catch (err) {

            console.log(`err of doValidateRegister:${err}`);
        }


    }
}