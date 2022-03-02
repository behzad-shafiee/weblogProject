const Blogger = require('../../module/blogger');
const Article = require('../../module/articles');


const bcrypt = require('bcrypt');
const multer = require('multer');
const tools = require('../tools/tools');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const { findById } = require('../../module/blogger');





module.exports = new class {



    async showBloggers(req, res) {
        try {

            console.log(req.session.blogger);
            if (req.session.blogger) {
                if (req.session.blogger.role === 'admin') {
                    const users = await Blogger.find({ role: 'blogger' });
                    res.render('adminDashboard', { users });
                }

            }
            else {
                res.render('loginPage', { msg: 'something is wrong!!!' })
            }

        }
        catch (err) {
            console.log(`err of show bloggers :${err}`);
        }

    }
    // blogger/dashboard

    showDashboardBlogger(req, res) {
       
         
            res.render('dashboard', { blogger: req.session.blogger, err: '', srcImgBlogger: req.session.blogger.avatar });
     


    }

    async doUpdateBloggerInfo(req, res) {

        try {

            const updatedData = req.body;
            const salt = await bcrypt.genSalt(5);
            const hashedPass = await bcrypt.hash(req.body.password, salt);
            updatedData.password = hashedPass;

            const user = await Blogger.findByIdAndUpdate(req.session.blogger._id, req.body);
            const result = await user.save();
            const articles = await Article.findOneAndUpdate({ writer: req.session.blogger.userName }, { writer: req.body.userName });
            req.session.blogger = result;
            res.render('dashboard', { blogger: updatedData, err: '', srcImgBlogger: req.session.blogger.avatar });


        } catch (err) {

            console.log(`err of update blogger :${err}`);
        }
    }


    async doDeleteBlogger(req, res) {
        try {

            const blogger = await Blogger.findByIdAndRemove(req.session.blogger._id);
            const articles = await Article.deleteMany({ writer: blogger.userName });
            console.log(articles);
            res.clearCookie('user_side');
            req.session.destroy(err => {
                if (err) {
                    return console.log(`can not destroy session err:${err}`);
                };
            });

            res.render('loginPage', { msg: ' user deleted successfully ' });


        } catch (err) {

            console.log(`can not findByIdAndDelete err:${err}`);
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
            } else {



                const validatePass = await bcrypt.compare(req.body.password, blogger.password);

                if (!validatePass) {
                    return res.render('loginPage', { msg: 'something is wrong!!!' });
                }
                blogger.password = req.body.password;
                res.cookie('user_side', blogger._id);
                req.session.blogger = blogger;
                if (blogger.role == 'admin') {

                    const users = await Blogger.find({ role: 'blogger' });
                    res.render('adminDashboard', { users });
                    return

                };
                console.log(req.session.blogger._id);
                res.redirect('/blogger/dashboard');
                // res.render('dashboard', { blogger, err: '', srcImgBlogger: req.session.blogger["avatar"] });

            }

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

            fs.unlinkSync(path.join(__dirname, `../../public/img/${req.session.blogger.avatar}`));
            req.session.blogger.avatar = req.file.filename;
            const user = await Blogger.findByIdAndUpdate(req.session.blogger._id, { avatar: req.file.filename });
            res.render('dashboard', { blogger: user, err: '', srcImgBlogger: req.session.blogger.avatar });
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
            }

            console.log(newArticle);
            const result = await newArticle.save();

            res.render('dashboard', { blogger: req.session.blogger, err: 'article created successfuuly', srcImgBlogger: req.session.blogger.avatar });

        } catch (err) {

            console.log(`err of creatNewArticle:${err}`);
        }

    }


    async showArticlesOfBlogger(req, res) {
        try {
            let page = req.params.page;
            let count = req.params.count;
            page = 1;
            count = 4;
            const writer = req.session.blogger.userName;
            const articles = await Article.find({ writer }).sort({ createdAt: -1 });
            res.render('bloggerArticles', { msg: 'wellcome to your articlesPage', articles: articles });

        } catch (err) {

            console.log(`err of showArticlesOfBlogger:${err}`);
        }

    }


    async showWholeArticles(req, res) {


        try {

            const writer = req.session.blogger.userName;
            const articles = await Article.find({}).sort({ createdAt: -1 });
            res.render('wholeArticles', { msg: 'wellcome articlesPage', articles: articles });

        } catch (err) {

            console.log(`err of showArticlesOfBlogger:${err}`);
        }

    }



    async doUpdateInBloggerArticlePage(req, res, nex) {


        try {


            console.log(req.body);
            const dataArticleTmp = JSON.parse(JSON.stringify(req.body));
            dataArticleTmp.textArticle = dataArticleTmp.textArticle.trim();
            const idArticle = dataArticleTmp.idArticle.trim();
            const article = await Article.findById(idArticle);
            const dataArticle = {};

            for (var key in dataArticleTmp) {

                if (!dataArticleTmp[key] || dataArticleTmp[key] == '                                            ') {
                    continue

                }
                dataArticle[key] = dataArticleTmp[key]

            };
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
            res.redirect('/blogger/dashboard/articles/seeMine');

        } catch (err) {

            console.log(`err of doUpdateInBloggerArticlePage:${err}`);
        }
    }


    async doUpdateInWholeArticlePage(req, res, nex) {


        try {

            console.log(req.body);
            const dataArticleTmp = JSON.parse(JSON.stringify(req.body));
            dataArticleTmp.textArticle = dataArticleTmp.textArticle.trim();
            const idArticle = dataArticleTmp.idArticle.trim();
            const article = await Article.findById(idArticle);
            const allArticle = await Article.find({});
            console.log(req.session.blogger.userName);
            console.log(article.writer);
            console.log(req.session.blogger.userName !== article.writer);
            if (req.session.blogger.userName !== article.writer) {
                if (req.file) {

                    fs.unlinkSync(path.join(__dirname, `../../public/img/${req.file.filename}`));
                }

                return res.render('wholeArticles', { msg: 'access denied', articles: allArticle });

            }

            const dataArticle = {};

            for (var key in dataArticleTmp) {

                if (!dataArticleTmp[key] || dataArticleTmp[key] == '                                            ') {
                    continue

                }
                dataArticle[key] = dataArticleTmp[key]

            };
            if (req.file) {
                fs.unlinkSync(path.join(__dirname, `../../public/img/${article.image}`));
                console.log(path.join(__dirname, `../../public/img/${article.image}`));
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
            res.redirect('/blogger/dashboard/articles/seeAll');


        } catch (err) {

            console.log(`err of doUpdateInWholeArticlePage:${err}`);
        }
    }


    async doDeleteInBloggerArticlePage(req, res) {

        try {

            const idArticle = req.body.idArticle.trim();
            const result = await Article.findByIdAndRemove(idArticle);
            const articles = await Article.find({ writer: req.session.blogger.userName });
            res.render('bloggerArticles', { msg: 'Article Deleted Successfully', articles });


        } catch (err) {

            console.log(`err of doDeleteInBloggerArticlePage:${err}`);
        }
    }


    async doDeleteInBloggerArticlePage(req, res) {

        try {

            const idArticle = req.body.idArticle.trim();
            const result = await Article.findByIdAndRemove(idArticle);
            const articles = await Article.find({ writer: req.session.blogger.userName });
            res.render('bloggerArticles', { msg: 'Article Deleted Successfully', articles });


        } catch (err) {

            console.log(`err of doDeleteInBloggerArticlePage:${err}`);
        }
    }

    async doDeleteInWholeArticlePage(req, res) {

        try {
            console.log(req.body);
            const idArticle = req.body.idArticle.trim();
            const article = await Article.findById(idArticle);
            const allArticle = await Article.find({});
            if (req.session.blogger.userName !== article.writer) {
                if (req.file) {

                    fs.unlinkSync(path.join(__dirname, `../../public/img/${req.file.filename}`));
                }

                return res.render('wholeArticles', { msg: 'access denied', articles: allArticle });

            }
            const result = await Article.findByIdAndRemove(idArticle);
            const articles = await Article.find({ writer: req.session.blogger.userName });
            res.render('bloggerArticles', { msg: 'Article Deleted Successfully', articles });


        } catch (err) {

            console.log(`err of doDeleteInWholeArticlePage:${err}`);
        }
    }


    async showDetailsOneArticle(req, res) {

        try {
            const idArticle = req.body.idArticle.trim();
            const article = await Article.findById(idArticle);
            res.render('articlePage', { article, msg: null })


        } catch (err) {

            console.log(`err of showDetailsOneArticle:${err}`);

        }

    }


    
    async showDetailsOneArticleInWholePageArticle(req, res) {

        try {

            const idArticle = req.body.idArticle.trim();
            const article = await Article.findById(idArticle);
            if (req.session.blogger.userName !== article.writer) {
                if (req.file) {

                    fs.unlinkSync(path.join(__dirname, `../../public/img/${req.file.filename}`));
                }

                return res.render('wholeArticles', { msg: 'access denied', articles: allArticle });

            }
            res.render('articlePage', { article, msg: null })


        } catch (err) {

            console.log(`err of showDetailsOneArticle:${err}`);

        }

    }

}