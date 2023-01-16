// const connection = require('./../../config/database');
const db = require('./../../config/database-admin');
var md5 = require('md5');
const connection = db.connection;

var crypto = require('crypto');
var session = require('express-session');
//validate user for admin 
exports.index = function (req, res) {
    const result = {};
    var params = null;
    if (req.method == 'POST') {
        params = req.body;
        // var passdata = crypto.createHash('md5').update(params.password).digest('hex');
        var passdata = md5(params.password);
        // console.log("pass: ", passdata);

        var sql_query = "SELECT * FROM users WHERE user_email = '" + params.username + "' AND user_password = '" + passdata + "' AND user_type='" + params.user_type + "' AND user_status='enable'";
        console.log("Inserted: ", sql_query);
        connection.query(sql_query, function (err, result) {
            if (err) {
                res.render('login', { 'title': 'Login', 'params': 'Something went wrong here!!' });
            } else {
                var userData = {
                    info: result
                };
                if (userData.info === undefined || userData.info.length <= 0) {
                    res.render('login', { 'title': 'Login', 'params': 'Invalid Login Credentials!' });
                } else {
                    console.log("details: ", userData.info[0]);
                    req.session.username = params.username;
                    req.session.userid = userData.info[0].user_id;
                    req.session.usertype = params.user_type;
                    //Session set when user Request our app via URL
                    console.log("username: " + req.session.username);
                    console.log("type: " + req.session.usertype);
                    if (req.session.username) {
                        res.render('dashboard', { 'datatitle': req.session.username, 'usertype': req.session.usertype });
                    } else {
                        res.render('login', { 'title': 'Login', 'params': 'Something went wrong!' });
                    }
                }
            }
        });
    } else {
        console.log("no method still");
        res.render('login', { 'title': 'Login', 'params': JSON.stringify(params) });
    }
}

exports.auth = function (req, res) {
    const result = {};
    var params = null;
    console.log("sess1: " + req.session.usertype);
    if (req.session.username) {
        res.render('dashboard', { 'datatitle': req.session.username, 'usertype': req.session.usertype });
    }
    else {
        res.redirect('login');
    }

}
