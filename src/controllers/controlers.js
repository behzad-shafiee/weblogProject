const Blogger = require('../../models/blogger');
const Article = require('../../models/articles');
const Comment = require('../../models/comment');

const bcrypt = require('bcrypt');
const multer = require('multer');
const tools = require('../tools/tools');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const { create } = require('lodash');







module.exports = new class {

    backDashboar(req, res) {

        if (req.session.blogger.role === 'admin') {
            return req.params.role = 'admin'
        }

        req.params.role = 'blogger'
    }

    showDashboardUser(req, res) {
        if (req.session.blogger.role === 'admin') {
            req.params.role = 'admin';
            return res.render('admin/dashboard', { blogger: req.session.blogger, msg: '', srcImgBlogger: req.session.blogger.avatar, role: 'admin' });
        }
        req.params.role = 'blogger'
        res.render('blogger/dashboard', { blogger: req.session.blogger, msg: '', srcImgBlogger: req.session.blogger.avatar, role: 'blogger' });

    }

    async showBloggers(req, res) {
        try {

            const users = await Blogger.find({ role: { $ne: 'admin' } });
            res.render('listOfBloggers', { msg: 'wellcome admin', users });

        } catch (err) {

        }


    }


    async doUpdateBloggerInfo(req, res) {

        try {



            const avatar = req.session.blogger.avatar;
            const user = await Blogger.findByIdAndUpdate(req.session.blogger._id, req.body);
            const articles = await Article.updateMany({ writer: req.session.blogger.userName }, { writer: req.body.userName });
            const updateComment = await Comment.updateMany({ writer: req.session.blogger.userName }, { writer: req.body.userName });
            req.session.blogger = req.body;
            const salt = await bcrypt.genSalt(5);
            const hashedPass = await bcrypt.hash(req.body.password, salt);
            user.password = hashedPass;
            const result = await user.save();
            console.log(articles);
            console.log(updateComment);
            req.session.blogger.avatar = avatar;

            if (req.session.blogger.role === 'admin') {
                req.params.role = 'admin';
                return res.render('admin/dashboard', { blogger: req.session.blogger, err: '', srcImgBlogger: req.session.blogger.avatar, role: 'admin' });
            };

            req.params.role = 'blogger';
            res.render('blogger/dashboard', { blogger: req.session.blogger, err: '', srcImgBlogger: req.session.blogger.avatar });


        } catch (err) {

            console.log(`err of update blogger :${err}`);
        }
    }


    async doDeleteBlogger(req, res) {
        try {
            const blogger = await Blogger.findByIdAndRemove(req.session.blogger._id);
            console.log(blogger);
            const deleteComment = await Comment.deleteMany({ writer: blogger.userName })
            const articles = await Article.deleteMany({ writer: blogger.userName });

            if (req.session.blogger.avatar !== 'avatarDefault.png') {

                fs.unlinkSync(path.join(__dirname, `../../public/img/${req.session.blogger.avatar}`));
            };

            res.clearCookie('user_side');
            req.session.destroy(err => {
                if (err) {
                    return console.log(`can not destroy session err:${err}`);
                };
            });



            res.render('loginPage', { msg: ' user deleted successfully ' });


        } catch (err) {

            console.log(`err of doDeleteBlogger:${err}`);
        }
    }


    showLoginPage(req, res) {
        res.render('loginPage', { msg: null });
    }


    async doLogin(req, res) {

        try {

            const blogger = await Blogger.findOne({ userName: req.body.userName });

            if (!blogger) {
                return res.render('loginPage', { msg: 'something is wrong!!!' });

            }

            const validatePass = await bcrypt.compare(req.body.password, blogger.password);

            if (!validatePass) {
                return res.render('loginPage', { msg: 'something is wrong!!!' });
            }
            blogger.password = req.body.password;
            res.cookie('user_side', blogger._id);
            req.session.blogger = blogger;
            console.log(req.session.blogger._id);
            if (blogger.role === 'admin') {

                return res.redirect('/admin/dashboard');
            }


            res.redirect('/blogger/dashboard');


        } catch (err) {
            console.log(`not found err:${err}`);
        }
    }

    doLogout(req, res) {
        res.clearCookie('user_side');
        console.log(req.session.blogger);
        req.session.destroy(err => {
            if (err) {
                return console.log(`can not destroy session err:${err}`);
            };
        });
        res.render('loginPage', { msg: 'you logOut successfully' });
    }


    showRegisterPage(req, res) {

        res.render('registerPage', { error: null });
    }



    async doRegister(req, res, next) {

        try {
            console.log(req.body);

            const salt = await bcrypt.genSalt(5);
            const hashedPass = await bcrypt.hash(req.body.password, salt);
            const user = new Blogger(req.body);
            user.password = hashedPass;

            if (req.file) {

                user.avatar = req.file.filename;
            }

            const result = await user.save();
            return res.render('loginPage', { msg: 'you register succussfully' })


        } catch (err) {

            console.log(`err of do register:${err}`);
        }


    }


    async doUpdateAvatar(req, res, next) {

        try {

            if (req.file && req.session.blogger.avatar !== 'avatarDefault.png') {

                fs.unlinkSync(path.join(__dirname, `../../public/img/${req.session.blogger.avatar}`));

            };
            req.session.blogger.avatar = req.file.filename;
            const user = await Blogger.findByIdAndUpdate(req.session.blogger._id, { avatar: req.file.filename });
            if (req.session.blogger.role === 'admin') {
                req.params.role = 'admin';
                return res.render('admin/dashboard', { blogger: req.session.blogger, msg: 'avatar updated successfully', srcImgBlogger: req.session.blogger.avatar });
            };
            req.params.role = 'blogger';
            res.render('blogger/dashboard', { blogger: req.session.blogger, msg: 'avatar updated successfully', srcImgBlogger: req.session.blogger.avatar });
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
            newArticle.writer = req.session.blogger.userName;
            if (req.file) {

                newArticle.image = req.file.filename;
            };
            const result = await newArticle.save();
            if (req.session.blogger.role === 'admin') {
                req.params.role = 'admin';
                return res.render('admin/dashboard', { blogger: req.session.blogger, msg: 'new article created successfully', srcImgBlogger: req.session.blogger.avatar, role: 'admin' });
            };

            req.params.role = 'blogger';
            res.render('blogger/dashboard', { blogger: req.session.blogger, msg: 'new article created successfully', srcImgBlogger: req.session.blogger.avatar });

        } catch (err) {

            console.log(`err of creatNewArticle:${err}`);
        }

    }


    async showArticlesOfBlogger(req, res) {
        try {

            // let page = req.params.page;
            // let count = req.params.count;
            // page = 1;
            // count = 4;
            const writer = req.session.blogger.userName;
            const articles = await Article.find({ writer }).sort({ createdAt: -1 });
            if (req.session.blogger.role === 'admin') {
                req.params.role = 'admin';
                return res.render('admin/myArticles', { msg: '', articles: articles, role: req.session.blogger.role, role: 'admin' });
            };
            req.params.role = 'blogger';

            res.render('blogger/myArticles', { msg: '', articles: articles, role: req.session.blogger.role, role: 'admin' });

        } catch (err) {

            console.log(`err of showArticlesOfBlogger:${err}`);
        }

    }


    async showWholeArticles(req, res) {


        try {

            const writer = req.session.blogger.userName;
            const articles = await Article.find({}).sort({ createdAt: -1 });
            if (req.session.blogger.role === 'admin') {

                return res.render('admin/myArticles', { msg: 'wellcome articlesPage', articles: articles, role: 'admin' });

            };

            res.render('blogger/myArticles', { msg: 'wellcome articlesPage', articles: articles, role: 'blogger' });

        } catch (err) {

            console.log(`err of showArticlesOfBlogger:${err}`);
        }

    }



    async doUpdateArticle(req, res, nex) {


        try {


            console.log(req.body);
            const dataArticleTmp = JSON.parse(JSON.stringify(req.body));
            dataArticleTmp.textArticle = dataArticleTmp.textArticle.trim();
            const idArticle = dataArticleTmp.idArticle.trim();
            const article = await Article.findById(idArticle);
            const dataArticle = {};


            if (req.file) {
                fs.unlinkSync(path.join(__dirname, `../../public/img/${article.image}`));
                dataArticle.image = req.file.filename;
            };
            dataArticle.idArticle = idArticle;
            console.log(dataArticle);

            const updatedArticle = await Article.findByIdAndUpdate(idArticle, {
                title: dataArticle.titleArticle,
                text: dataArticle.textArticle,
                image: dataArticle.image
            });
            const result = await updatedArticle.save();
            if (req.session.blogger.role === 'admin') {

                return res.redirect('/admin/dashboard/articles/seeMine');
            }

            res.redirect('/blogger/dashboard/articles/seeMine');

        } catch (err) {

            console.log(`err of doUpdateInBloggerArticlePage:${err}`);
        }
    }




    async doDeleteArticle(req, res) {

        try {

            console.log(req.body);
            const idArticle = req.body.idArticle.trim();
            console.log(idArticle);
            const result = await Article.findByIdAndRemove(idArticle);
            const articles = await Article.find({ writer: req.session.blogger.userName });
            fs.unlinkSync(path.join(__dirname, `../../public/img/${result.image}`));
            console.log(req.session.blogger.role);
            if (req.session.blogger.role === 'admin') {

                return res.render('admin/myArticles', { msg: 'Article Deleted Successfully', articles, role: 'admin' });
            }

            res.render('blogger/myArticles', { msg: 'Article Deleted Successfully', articles, role: 'blogger' });


        } catch (err) {

            console.log(`err of doDeleteInBloggerArticlePage:${err}`);
        }
    }



    async showDetailsOneArticle(req, res) {

        try {

            const dataArticleTmp = JSON.parse(JSON.stringify(req.body));
            const idArticle = dataArticleTmp.idArticle.trim();
            const article = await Article.findById(idArticle);
            const comment = await Comment.find({ idArticle });
            console.log(comment);
            if (req.session.blogger.role === 'admin') {
                return res.render('detailArticleAdmin', { article, msg: null, comment, role: 'admin' })
            }

            res.render('detailArticleBlogger', { article, msg: null, comment, role: 'blogger' })


        } catch (err) {

            console.log(`err of showDetailsOneArticle:${err}`);

        }

    }




    async doChangePassBlogger(req, res) {

        try {


            console.log(req.body);
            const salt = await bcrypt.genSalt(5);
            const hashedPass = await bcrypt.hash(req.body.password, salt);

            const idBlogger = req.body.idBlogger.trim();
            const user = await Blogger.findById(idBlogger);
            console.log(user);
            const updatePass = await Blogger.findByIdAndUpdate(idBlogger, { password: hashedPass });

            const result = updatePass.save();
            const users = await Blogger.find({});
            res.render('listOfBloggers', { users, msg: 'change pass doing successfuly' })

        } catch (err) {

            console.log(`err of doChangePassBlogger:${err}`);
        }
    }


    async doDeleteArticleOfBloggers(req, res) {
        try {

            console.log(req.body);
            const deleteArticle = await Article.findByIdAndRemove(req.body.idArticle);
            fs.unlinkSync(path.join(__dirname, `../../public/img/${deleteArticle.image}`));
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
            const writer = req.session.blogger.userName;
            const idArticle = req.body.idArticle;
            const comment = await Comment.create({ writer, text, idArticle });
            const article = await Article.findById(idArticle);
            if (req.session.blogger.role === 'admin') {
                return res.redirect('/admin/dashboard/articles/seeAll/detailsOneArticle');
            };

            res.redirect('/blogger/dashboard/articles/seeAll');


        } catch (err) {

            console.log(`err of setComment:${err}`);
        }
    }
}