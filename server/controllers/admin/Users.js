const db = require('./../../config/database-admin');
const connection = db.connection;

const Model_users = require('../../models/admin/Users');
var session = require('express-session');
var crypto = require('crypto');
const nodemailer = require('nodemailer');
var md5 = require('md5');

// var formidable = require('formidable');
var fs = require('fs-extra');
var mv = require('mv');
// var im = require('imagemagick');

const multer = require('multer');
const upload = multer().single('file');


var clientData = null;
var resultData = null;

exports.index = function (req, res, next) {
    if (!req.session.username || req.session.username == undefined) {
        res.redirect('./../auth');
    } else {
        if (req.body.user_type) {
            var userType = req.body.user_type;
        } else {
            var userType = 'vendor';
        }
        console.log("type: ", userType); // selected from dropdown
        // req.session.usertype // loggedin user type check

        Model_users.getUsersLists(userType, function (err, result) {
            // console.log(result);
            // res.render('users', { 'datatitle': req.session.username, 'userdata': result });
            res.render('users', { 'datatitle': req.session.username, 'user_type': userType, 'usertype': req.session.usertype, 'userdata': result });
        });
    }
}

exports.addusers = function (req, res) {
    var result = null;
    if (!req.session.username || req.session.username == undefined) {
        res.redirect('./../auth');
    } else {
        if (req.method == 'POST') {
            fields = req.body;

            req.checkBody('user_email', "Email address is required.").notEmpty().isEmail();
            req.checkBody('user_mobile', 'Mobile Number is required').notEmpty();
            req.checkBody('user_address', 'Address is required.').notEmpty();

            var errors = req.validationErrors();
            // console.log("err: +", errors);

            if (errors) {
                req.session.errors = errors;
                req.session.success = false;
                res.render('users/addusers', { 'data': fields, 'datatitle': req.session.username, 'usertype': req.session.usertype, 'msgdata': msgdata, success: req.session.success, errors: req.session.errors });
                return;
            } else {
                req.session.errors = null;
                req.session.success = true;
                // user check with email resgistered or not
                Model_users.userChk(fields, function (err, result) {
                    if (err) {
                    } else {
                        resultData = result;
                        var string = JSON.stringify(resultData);
                        var json = JSON.parse(string);

                        if (json.length > 0) {
                            msgdata = "User email already exist";
                            res.render('users/addusers', { 'data': fields, 'datatitle': req.session.username, 'usertype': req.session.usertype, 'msgdata': msgdata, success: req.session.success, errors: req.session.errors });
                        }
                        else {
                            var randomstring = Math.random().toString(36).slice(-8);
                            console.log("randomstring: ", randomstring); // login through this string

                            var passdata = crypto.createHash('md5').update(randomstring).digest('hex');
                            console.log("passdata: ", passdata);

                            Model_users.save(fields, passdata);

                            // Start to write here for mail to send the details on email....
                            var sqlEmail = "select * from email_templates where id =11";
                            connection.query(sqlEmail, function (err, rows) {
                                if (err) {
                                    throw err;
                                } else {
                                    // callback(null, rows);
                                    var description = '';
                                    var emailTemplate = JSON.stringify(rows[0]);

                                    var emailTemplateData = JSON.parse(emailTemplate);
                                    console.log("descs: ", emailTemplateData)
                                    description = emailTemplateData.content

                                    description = description.replace('##user_name##', fields.user_email)
                                    description = description.replace('##user_email##', fields.user_email)
                                    description = description.replace('##user_password##', randomstring)
                                    description = description.replace('##user_mobile##', fields.user_mobile)
                                    description = description.replace('##user_address##', fields.user_address)

                                    console.log("descs here: ", description)

                                    var transporter = nodemailer.createTransport({
                                        host: 'smtpout.secureserver.net',
                                        port: 465,
                                        secure: true,
                                        auth: {
                                            user: 'service@fitroz.com',
                                            pass: 'FITROZservice2021!'
                                        }
                                    });
                                    var mailOptions = {
                                        from: emailTemplateData.from_email,
                                        to: fields.user_email,
                                        subject: emailTemplateData.subject,
                                        html: description,
                                        // res.setHeader('Content-Type', 'text/plain');
                                    };
                                    transporter.sendMail(mailOptions, function (error, info) {
                                        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                                        if (error) {
                                            res.send({ mailSent: false, msg: error });
                                            console.log("erors: " + error);
                                            // res.redirect('index');
                                        } else {
                                            res.send({ mailSent: true, msg: 'User added successfully' });
                                            // res.redirect('index');
                                            console.log('Email sent: ' + info.response);
                                        }
                                        transporter.close();
                                    });
                                    // End here
                                    res.redirect('index');
                                }
                            });
                            // End mail here

                            // msgdata = "User added successfully";
                            // res.redirect('index');
                        }
                    }
                });
            }
        } else {
            var fields = null;
            var msgdata = null;
            // req.session.errors = errors;
            req.session.success = true;
            req.session.errors = null;
            res.render('users/addusers', { data: {}, 'datatitle': req.session.username, 'usertype': req.session.usertype, 'msgdata': msgdata, success: req.session.success, errors: req.session.errors });
        }
    } /*****************************end login check***********************/
}

exports.edit_user = function (req, res) {
    if (!req.session.username || req.session.username == undefined) {
        res.redirect('./../auth');
    }
    else {
        if (req.method == 'POST') {
            var userId = req.query.user_id;
            fields = req.body;

            Model_users.userIDChk(userId, function (err, result) {

                req.checkBody('user_email', 'Email is required').notEmpty();
                req.checkBody('user_mobile', 'Valid phone number is required.').notEmpty();
                req.checkBody('user_address', 'Address is required').notEmpty();

                var errors = req.validationErrors();

                if (err) {
                } else {
                    clientData = result[0];
                    var string = JSON.stringify(clientData);
                    var jsonData = JSON.parse(string);

                    if (errors) {
                        var msgdata = null;
                        req.session.errors = errors;
                        req.session.success = false;
                        res.render("users/edit_user", { 'datatitle': req.session.username, 'usertype': req.session.usertype, 'msgdata': msgdata, 'client_data': jsonData, success: req.session.success, errors: req.session.errors });
                        return;
                    } else {
                        req.session.errors = null;
                        req.session.success = true;

                        var credentials = { userId: userId, fields: req.body };
                        Model_users.userIDExistingChk(credentials, function (err, result) {
                            if (err) {
                            } else {
                                resultData = result;
                                // console.log("userData: ", resultData);
                                var string = JSON.stringify(resultData);
                                var jsonDataLen = JSON.parse(string);

                                if (jsonDataLen.length > 0) {
                                    msgdata = "User name already exist";
                                    res.render('users/edit_user', { 'datatitle': req.session.username, 'usertype': req.session.usertype, 'msgdata': msgdata, 'client_data': jsonData, success: req.session.success, errors: req.session.errors });
                                }
                                else {
                                    Model_users.updateUser(fields, userId);
                                    msgdata = "User updated successfully";
                                    res.redirect('index');
                                }
                            }
                        });

                    }
                }
            });
        }
        else {
            var msgdata = null;
            // req.session.errors = errors;
            req.session.success = true;
            req.session.errors = null;

            console.log("user_id: ", req.query.user_id);
            var id = req.query.user_id;
            Model_users.userIDChk(id, function (err, result) {
                if (err) {
                } else {
                    clientData = result[0];
                    var string = JSON.stringify(clientData);
                    var jsonData = JSON.parse(string);
                    res.render('users/edit_user', { 'datatitle': req.session.username, 'usertype': req.session.usertype, 'msgdata': msgdata, 'client_data': jsonData, success: req.session.success, errors: req.session.errors });
                }
            });
        }
    }
}

exports.delete_user = function (req, res) {
    var result = null;
    var paramsdata = null;
    var del_data = null;
    if (!req.session.username || req.session.username == undefined) {
        res.redirect('./../auth');
    } else {
        console.log("userid: ", req.query.user_id);
        console.log("stat", req.query.delet);
        var del = req.query.delet;
        var userid = req.query.user_id;
        if (del == 'disable') {
            del_data = 'enable';
        }
        if (del == 'enable') {
            del_data = 'disable';
        }
        console.log("up: ", "UPDATE users set user_status ='" + del_data + "' WHERE user_id=" + userid);
        connection.query("UPDATE users set user_status='" + del_data + "' WHERE user_id=" + userid, function (err, result) {
            if (err) {
                throw err;
            } else {
            } res.redirect('index');
        });
    }
}

exports.adduserslist = function (req, res) {
    var result = null;
    if (!req.session.username || req.session.username == undefined) {
        res.redirect('./../auth');
    } else {
        connection.query("select * from users u join clients c on u.client_id=c.client_id ", function (err, result) {
            if (err) {
                //   res.render('login', { 'title': 'Login', 'params': JSON.stringify(params) });
            } else {
            } //console.log(result.rows); 
            res.render('index', { 'datatitle': req.session.username, 'usertype': req.session.usertype, 'userdata': result.rows });
        });
    }
}

exports.change_password = function (req, res) {
    var result = null;
    if (!req.session.username || req.session.username == undefined) {
        res.redirect('./../auth');
    } else {
        if (req.method == 'POST') {
            fields = req.body;
            var userId = req.session.userid;

            req.checkBody('user_password', "New password is required.").notEmpty();
            req.checkBody('confirm_password', 'Confirm password is required').notEmpty();
            req.checkBody('confirm_password', 'Password do not match').equals(req.body.user_password);

            var errors = req.validationErrors();
            // console.log("err: +", errors);

            if (errors) {
                req.session.errors = errors;
                req.session.success = false;
                res.render('users/change_password', { 'data': fields, 'datatitle': req.session.username, 'usertype': req.session.usertype, 'msgdata': msgdata, success: req.session.success, errors: req.session.errors });
                return;
            } else {
                req.session.errors = null;
                req.session.success = true;
                // user check with email resgistered or not
                var passdata = md5(fields.user_password);
                Model_users.passwordChange(passdata, userId);

                msgdata = "Password Changed successfully";
                res.render('users/change_password', { 'data': '', 'datatitle': req.session.username, 'usertype': req.session.usertype, 'msgdata': msgdata, success: req.session.success, errors: req.session.errors });
            }
        } else {
            var fields = null;
            var msgdata = null;
            req.session.success = true;
            req.session.errors = null;
            res.render('users/change_password', { data: {}, 'datatitle': req.session.username, 'usertype': req.session.usertype, 'msgdata': msgdata, success: req.session.success, errors: req.session.errors });
        }
    } /*****************************end login check***********************/
}