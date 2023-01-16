var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
const fileUpload = require('express-fileupload');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
// var flash = require('express-flash');
// var index = require('./routes/index');
var admin = require('./routes/admin');
var ejsMate = require('ejs-mate');
var expressValidator = require('express-validator');
// var flash = require('flash');
// var flash = require('req-flash');
var flash = require('express-flash');
// const flash = require('connect-flash');

var app = express();
app.use(session({ secret: 'ssshhhhh' }));

app.use(bodyParser.json());
// app.use(expressValidator());

// app.use(expressValidator({
//     customValidators: {
//         isImage: function (value, filename) {
//             var extension = (path.extname(filename)).toLowerCase();
//             switch (extension) {
//                 case '.jpg':
//                     return '.jpg';
//                 case '.jpeg':
//                     return '.jpeg';
//                 case '.png':
//                     return '.png';
//                 default:
//                     return false;
//             }
//         }
//     }
// }));

// app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(flash());
console.log("In App.js");

// view engine setup
app.engine('ejs', ejsMate);
// view engine setup

app.set('views', path.join(__dirname, 'views/admin'));
app.set('view engine', 'ejs');

// const { initPayment, responsePayment } = require("./paytm/services/index");

// ######## End Access-Control-Allow-Origin ###### //
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.header('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.header('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
// ######## Start Access-Control-Allow-Origin ###### //
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(fileUpload());

app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);
app.use('/admin', admin);

// app.get("/paywithpaytm", (req, res) => {
//   initPayment(req.query.amount).then(
//     success => {
//       res.render("paytmRedirect.ejs", {
//         resultData: success,
//         // paytmFinalUrl: process.env.PAYTM_FINAL_URL
//         paytmFinalUrl: "https://securegw-stage.paytm.in/theia/processTransaction"
//       });
//     },
//     error => {
//       res.send(error);
//     }
//   );
// });

// app.post("/paywithpaytmresponse", (req, res) => {
//   responsePayment(req.body).then(
//     success => {
//       res.render("response.ejs", { resultData: "true", responseData: success });
//     },
//     error => {
//       res.send(error);
//     }
//   );
// });


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   // var err = new Error('Not Found');
//   // err.status = 404;
//   // next(err);
//   res.status(404);
//   res.render('404');
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.status = err.status;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
