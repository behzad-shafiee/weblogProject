const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const dotenv = require('dotenv');
const config = dotenv.config();
if (config.error) {
    return console.log(error);
};


const creatAdmin = require('./creatAdmin');
creatAdmin.creatAdmin();

const Blogger = require('./module/blogger');
const mainRoute = require('./src/apis/index');
const multerRoute = require('./src/apis/blogger/multer');
//blogger =>type
//login => session
//enter loginAdmin
//ui












// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
        key: "user_side",
        secret: "mySecret",
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 360000
        }
    })
);



app.get('/', (req, res) => {
    res.render('test')
});

app.post('/do', (req, res) => {
    console.log(req.body);
    console.log(req.header);
});




app.listen(port, () => {

    console.log(`server is running on port:${port}`);

})

