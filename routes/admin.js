var express = require('express');
var router = express.Router();
var path = require('path');

var Dashboard = require('./../server/controllers/admin/Dashboard');
var Auth = require('./../server/controllers/admin/Auth');
var Users = require('./../server/controllers/admin/Users');
var Logout = require('./../server/controllers/admin/Logout');
const { response } = require('../app');
// const flash = require('connect-flash');
var flash = require('express-flash');

router.use(flash());

console.log("In Admin.js here");
/* GET users listing. */
/********************ETL************************/
router.get('/auth', Auth.auth);
/*********************************************/

router.get('/', Auth.index);
router.get('/auth', Auth.index);
router.post('/auth', Auth.index);
router.get('/login', Auth.index);
router.get('/logout', Logout.index);
router.post('/logout', Logout.index);

//Users section
router.get('/users/index', Users.index);
router.post('/users/index', Users.index);
router.get('/users/addusers', Users.addusers);
router.post('/users/addusers', Users.addusers);
router.get('/users/edit_user', Users.edit_user);
router.post('/users/edit_user', Users.edit_user);
router.get('/users/delete_user', Users.delete_user);



router.get('/dashboard', Dashboard.index);
// router.get('/users/change_password', Users.change_password);
// router.post('/users/change_password', Users.change_password);

module.exports = router;
