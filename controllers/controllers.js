const User = require('../models/user');
const Article = require('../models/articles');
const Comment = require('../models/comment');

const bcrypt = require('bcrypt');
const multer = require('multer');
const tools = require('../tools/tools');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const { create } = require('lodash');







module.exports = new class {

    backDashboar(req, res) {

        if (req.session.user.role === 'admin') {
            return req.params.role = 'admin'
        }

        req.params.role = 'blogger'
    }

    showDashboard(req, res) {
        if (req.session.user.role === 'admin') {
            req.params.role = 'admin';
            return res.render('admin/dashboard', { user: req.session.user, msg: '', srcImgUser: req.session.user.avatar, role: 'admin' });
        }
        req.params.role = 'blogger'
        res.render('blogger/dashboard', { user: req.session.user, msg: '', srcImgUser: req.session.user.avatar, role: 'blogger' });

    }

    async showBloggers(req, res) {
        try {

            const users = await User.find({ role: { $ne: 'admin' } });
            res.render('admin/listOfBloggers', { msg: '', users });

        } catch (err) {

            console.log(`err of showBloggers:${err}`);
        }


    }


    async doUpdateUserInfo(req, res) {

        try {



            const avatar = req.session.user.avatar;
            const user = await User.findByIdAndUpdate(req.session.user._id, req.body);
            const articles = await Article.updateMany({ writer: req.session.user.userName }, { writer: req.body.userName });
            const updateComment = await Comment.updateMany({ writer: req.session.user.userName }, { writer: req.body.userName });
            req.session.user = req.body;
            const salt = await bcrypt.genSalt(5);
            const hashedPass = await bcrypt.hash(req.body.password, salt);
            user.password = hashedPass;
            const result = await user.save();
            console.log(articles);
            console.log(updateComment);
            req.session.user.avatar = avatar;

            if (req.session.user.role === 'admin') {
                req.params.role = 'admin';
                return res.render('admin/dashboard', { user: req.session.user, msg: 'update info doing successfuuly', srcImgUser: req.session.user.avatar, role: 'admin' });
            };

            req.params.role = 'blogger';
            res.render('blogger/dashboard', { user: req.session.user, msg: 'update info doing successfuuly', srcImgUser: req.session.user.avatar });


        } catch (err) {

            console.log(`err of doUpdateUserInfo :${err}`);
        }
    }


    async doDeleteUser(req, res) {
        try {
            console.log(req.body);
            const idUser = req.body.idUser.trim()
            const user = await User.findByIdAndRemove(idUser);
            const role = user.role;
            console.log(role);
            const deleteComment = await Comment.deleteMany({ writer: user.userName })
            const articles = await Article.deleteMany({ writer: user.userName });

            if (req.session.user.avatar !== 'avatarDefault.png') {

                fs.unlinkSync(path.join(__dirname, `../public/img/${req.session.user.avatar}`));
            };

            res.clearCookie('user_side');
            req.session.destroy(err => {
                if (err) {
                    return console.log(`can not destroy session err:${err}`);
                };
            });

            const users = await User.find({ role: { $ne: 'admin' } });
            if (role === 'admin') {
                return res.render('admin/listOfBloggers', { msg: 'user deleted successfully', users });
            }


            return res.render('loginPage', { msg: 'you deleted succussfully' });


        } catch (err) {

            console.log(`err of doDeleteUser:${err}`);
        }
    }



    showLoginPage(req, res) {

        res.render('loginPage', { msg: null });
    }


    async doLogin(req, res) {

        try {
            console.log(req.body);
            const user = await User.findOne({ userName: req.body.userName });

            if (!user) {
                return res.render('loginPage', { msg: 'something is wrong!!!' });

            }

            const validatePass = await bcrypt.compare(req.body.password, user.password);

            if (!validatePass) {
                return res.render('loginPage', { msg: 'something is wrong!!!' });
            }
            user.password = req.body.password;
            res.cookie('user_side', user._id);
            req.session.user = user;
            console.log(req.session.user._id);
            if (user.role === 'admin') {

                return res.redirect('/admin/dashboard');
            }


            res.redirect('/blogger/dashboard');


        } catch (err) {
            console.log(`err of doLogin:${err}`);
        }
    }

    doLogout(req, res) {
        res.clearCookie('user_side');
        console.log(req.session.user);
        req.session.destroy(err => {
            if (err) {
                return console.log(`doLogout err => can not destroy session:${err}`);
            };
        });
        res.render('loginPage', { msg: 'you logOut successfully' });
    }


    showRegisterPage(req, res) {

        res.render('registerPage', { error: null });
    }



    async doRegister(req, res, next) {

        try {

            const salt = await bcrypt.genSalt(5);
            const hashedPass = await bcrypt.hash(req.body.password, salt);
            const user = new User(req.body);
            user.password = hashedPass;

            if (req.file) {

                user.avatar = req.file.filename;
            }

            const result = await user.save();
            return res.render('loginPage', { msg: 'you register succussfully' })


        } catch (err) {

            console.log(`err of doRegister:${err}`);
        }


    }


    async doUpdateAvatar(req, res, next) {

        try {

            if (req.file && req.session.user.avatar !== 'avatarDefault.png') {

                fs.unlinkSync(path.join(__dirname, `../public/img/${req.session.user.avatar}`));

            };
            req.session.user.avatar = req.file.filename;
            const user = await User.findByIdAndUpdate(req.session.user._id, { avatar: req.file.filename });
            if (req.session.user.role === 'admin') {
                req.params.role = 'admin';
                return res.render('admin/dashboard', { user: req.session.user, msg: 'avatar updated successfully', srcImgUser: req.session.user.avatar });
            };
            req.params.role = 'blogger';
            res.render('blogger/dashboard', { user: req.session.user, msg: 'avatar updated successfully', srcImgUser: req.session.user.avatar });
        }
        catch (err) {

            console.log(`err of doUpdateAvatar:${err}`);
        }

    }



    async creatNewArticle(req, res, next) {

        try {

            const newArticle = await new Article({
                title: req.body.titleArticle,
                text: req.body.textArticle,
            });
            newArticle.writer = req.session.user.userName;
            if (req.file) {

                newArticle.image = req.file.filename;
            };
            const result = await newArticle.save();
            if (req.session.user.role === 'admin') {
                req.params.role = 'admin';
                return res.render('admin/dashboard', { user: req.session.user, msg: 'new article created successfully', srcImgUser: req.session.user.avatar, role: 'admin' });
            };

            req.params.role = 'blogger';
            res.render('blogger/dashboard', { user: req.session.user, msg: 'new article created successfully', srcImgUser: req.session.user.avatar });

        } catch (err) {

            console.log(`err of creatNewArticle:${err}`);
        }

    }


    async showMyArticles(req, res) {
        try {

            const writer = req.session.user.userName;
            const articles = await Article.find({ writer }).sort({ createdAt: -1 });
            if (req.session.user.role === 'admin') {
                req.params.role = 'admin';
                return res.render('admin/myArticles', { msg: '', articles: articles, role: req.session.user.role, role: 'admin' });
            };
            req.params.role = 'blogger';

            res.render('blogger/myArticles', { msg: '', articles: articles, role: req.session.user.role, role: 'admin' });

        } catch (err) {

            console.log(`err of showMyArticles:${err}`);
        }

    }


    async showAllArticles(req, res) {


        try {

            const writer = req.session.user.userName;
            const articles = await Article.find({}).sort({ createdAt: -1 });
            if (req.session.user.role === 'admin') {

                return res.render('admin/allArticles', { msg: '', articles: articles, role: 'admin' });

            };

            res.render('blogger/allArticles', { msg: '', articles: articles, role: '' });

        } catch (err) {

            console.log(`err of showAllArticles:${err}`);
        }

    }



    async doUpdateArticle(req, res, nex) {


        try {


            console.log(req.body);
            const dataArticle = JSON.parse(JSON.stringify(req.body));
            console.log(dataArticle);
            dataArticle.textArticle = dataArticle.textArticle.trim();
            const idArticle = dataArticle.idArticle.trim();
            const article = await Article.findById(idArticle);

            if (req.file) {
                fs.unlinkSync(path.join(__dirname, `../public/img/${article.image}`));
                dataArticle.image = req.file.filename;
            };

            const updatedArticle = await Article.findByIdAndUpdate(idArticle, {
                title: dataArticle.titleArticle,
                text: dataArticle.textArticle,
                image: dataArticle.image
            });
            console.log(`updatedArticle:${updatedArticle}`);
            const result = await updatedArticle.save();
            if (req.session.user.role === 'admin') {

                return res.redirect('/admin/dashboard/articles/seeMine');
            }

            res.redirect('/blogger/dashboard/articles/seeMine');

        } catch (err) {

            console.log(`err of doUpdateArticle:${err}`);
        }
    }




    async doDeleteArticle(req, res) {

        try {

            console.log(req.body);
            const idArticle = req.body.idArticle.trim();
            console.log(idArticle);
            const result = await Article.findByIdAndRemove(idArticle);
            const articles = await Article.find({ writer: req.session.user.userName });
            fs.unlinkSync(path.join(__dirname, `../public/img/${result.image}`));
            console.log(req.session.user.role);
            if (req.session.user.role === 'admin') {

                return res.render('admin/myArticles', { msg: 'Article Deleted Successfully', articles, role: 'admin' });
            }

            res.render('blogger/myArticles', { msg: 'Article Deleted Successfully', articles, role: 'blogger' });


        } catch (err) {

            console.log(`err of doDeleteArticle:${err}`);
        }
    }



    async seeMoreArticle(req, res) {

        try {

            const dataArticleTmp = JSON.parse(JSON.stringify(req.body));
            const idArticle = dataArticleTmp.idArticle.trim();
            const article = await Article.findById(idArticle);
            const comment = await Comment.find({ idArticle });
            if (req.session.user.role === 'admin') {
                return res.render('admin/seeMoreArticle', { article, msg: null, comment })
            }

            res.render('blogger/seeMoreArticle', { article, msg: null, comment })


        } catch (err) {

            console.log(`err of seeMoreArticle:${err}`);

        }

    }




    async doChangePassBlogger(req, res) {

        try {


            console.log(req.body);
            const idUser = req.body.idUser.trim();
            const user = await User.findById(idUser);
            const salt = await bcrypt.genSalt(5);
            console.log('0' + user.phoneNumber);
            const hashedPass = await bcrypt.hash('0' + user.phoneNumber, salt);
            console.log(hashedPass);
            const updatePass = await User.findByIdAndUpdate(idUser, { password: hashedPass });
            const result = updatePass.save();
            const users = await User.find({ role: { $ne: 'admin' } });
            res.render('admin/listOfBloggers', { msg: 'password of user changed to his phoneNumber successfuly', users });

        } catch (err) {

            console.log(`err of doChangePassBlogger:${err}`);
        }
    }


    async doDeleteArticleOfBloggers(req, res) {
        try {

            console.log(req.body);
            const deleteArticle = await Article.findByIdAndRemove(req.body.idArticle);
            fs.unlinkSync(path.join(__dirname, `../public/img/${deleteArticle.image}`));
            const articles = await Article.find({});
            return res.render('wholeArticleForAdmin', { msg: 'article deleted succussfully', articles, role: 'admin' });

        } catch (err) {

            console.log(`err of doDeleteArticleOfBloggers:${err}`);
        }


    }



    async setComment(req, res) {

        try {
            console.log(req.body);
            const text = req.body.comment.trim();
            const writer = req.session.user.userName;
            const idArticle = req.body.idArticle;
            const comment = await Comment.create({ writer, text, idArticle });
            const article = await Article.findById(idArticle);
            if (req.session.user.role === 'admin') {
                return res.redirect('/admin/dashboard/');
            };

            res.redirect('/blogger/dashboard/');


        } catch (err) {

            console.log(`err of setComment:${err}`);
        }
    }

    async showComments(req, res) {

        try {
            const comments = await Comment.find({});
            res.render('admin/seeComments', { msg: '', comments });

        } catch (err) {

            console.log(`err of showComments:${err}`);
        }
    }

    async doDeleteComment(req, res) {

        try {
            console.log(req.body);
            const result = await Comment.findByIdAndRemove(req.body.idComment);
            const comments = await Comment.find({});
            res.render('admin/seeComments', { msg: 'comment deleted successfully', comments });


        } catch (err) {

            console.log(`err of doDeleteComment:${err}`);
        }
    }
}
