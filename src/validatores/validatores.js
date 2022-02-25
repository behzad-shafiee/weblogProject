
const { body, validationResult } = require('express-validator');
const validator = require('validator');
const Blogger = require('../../module/blogger');
const bcrypt = require('bcrypt');

module.exports = new class {



    arrOfValidateUpdateBloggerInfo() {

        return [
            body('userName').notEmpty().withMessage("userName is empty").isLength({ min: 2 }).withMessage('username must be at least 2 charcator'),
            body('password').notEmpty().withMessage("password is empty").isLength({ min: 8 }).withMessage('password must be at least 8 charcator'),
            body('firstName').notEmpty().withMessage("firstName is empty").isLength({ min: 2, max: 30 }).withMessage('firstname must be between 2-30'),
            body('lastName').notEmpty().withMessage("lastName is empty").isLength({ min: 2, max: 30 }).withMessage('lastname must be between 2-30'),
            body('phoneNumber').notEmpty().withMessage("phoneNumber is empty")
        ]
    }

    doValidateUpdateBloggerInfo(req, res, next) {

        const errors = validationResult(req);


        if (!errors.isEmpty()) {
            console.log(errors);
            console.log(req.session.blogger);
            res.render('dashboard', { blogger: req.session.blogger, err: 'all inputs must fills', errUpdateInfo: '', srcImgBlogger: req.session.blogger.avatar });
        }

        const phoneNumber = req.body.phoneNumber;
        if (!validator.isMobilePhone(phoneNumber, ['fa-IR'])) {

            console.log(`phoneNumber must be 11 digit and start with 09..`);
            res.render('dashboard', { blogger: req.session.blogger, err: 'phoneNumber must be 11 digit and start with 09..', errUpdateInfo: '', srcImgBlogger: req.session.blogger.avatar });

        }

        const regExp = /^(?=[^A-Z\n]*[A-Z])(?=[^a-z\n]*[a-z])(?=[^0-9\n]*[0-9])(?=[^#?!@$%^&*\n-]*[#?!@$%^&*-]).{8,}$/g;
        const checkPass = regExp.test(req.body.password);
        if (!checkPass) {
            console.log(req.body.password);
            console.log('password must be atleast one capital letter one small letter one number one special letter');
            res.render('dashboard', { blogger: req.session.blogger, err: 'password must be atleast one capital letter one small letter one number one special letter', errUpdateInfo: '', srcImgBlogger: req.session.blogger.avatar });
        };

        next();

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