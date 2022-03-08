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
    console.log(error);
};


const creatAdmin = require('./creatAdmin');
creatAdmin.creatAdmin();


const mainRoute = require('./src/apis/index');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middlewares
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



app.use('/', mainRoute);






// catch 404 and forward to error handler
// app.use(function(req, res, next) {

//     next(createError(404));

// });




// // error handler
// app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

// module.exports = app;


app.listen(port, () => {

    console.log(`server is running on port:${port}`);

})