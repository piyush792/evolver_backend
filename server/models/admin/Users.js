const db = require('./../../config/database-admin');
const connection = db.connection;
var crypto = require('crypto');
var session = require('express-session');
const _table = 'users';
const nodemailer = require('nodemailer');

exports.getUsersLists = function (userType, callback) {
	console.log("userType: ", userType);
	connection.query('select * from users where user_type="' + userType + '" order by user_id', function (err, rows) {
		if (err) throw err
		callback(null, rows);
	});
}

exports.userChk = function (from_data, callback) {
	var sql = "select user_email from users where user_email ='" + from_data.user_email + "'";
	console.log(sql);
	connection.query(sql, function (err, rows) {
		if (err) throw err
		callback(null, rows);
	});
}

exports.save = function (data = null, passdata) {
	// var _fromdata = setdata(data);

	var add_date = require('current-date');
	var dat = add_date('date');

	// var randomstring = Math.random().toString(36).slice(-8);
	// console.log("randomstring: ", randomstring); // login through this string

	// var passdata = crypto.createHash('md5').update(randomstring).digest('hex');
	// console.log("passdata: ", passdata);

	var sql = "insert into " + _table + "(fbid,google_id,user_email,user_password,user_mobile,seller_type,user_address,user_type,user_status,created_on) values ('', '', '" + data.user_email + "','" + passdata + "','" + data.user_mobile + "','" + data.seller_type + "', '" + data.user_address + "', 'vendor', '" + data.user_status + "', '" + dat + "')";
	// console.log("insert: ", sql);
	var fields = data;
	console.log("fields: ", fields);
	connection.query(sql, function (err, success) {
		if (err)
			throw err
		if (success) {
			console.log(success.insertId);
			return true;
		}
	});
}

exports.updateUser = function (data = null, userId) {
	// var _fromdata = setdata(data);
	var add_date = require('current-date');
	var dat = add_date('date');

	var sql = "update " + _table + " set user_email='" + data.user_email + "', user_mobile='" + data.user_mobile + "', seller_type='" + data.seller_type + "', user_address='" + data.user_address + "', user_status='" + data.user_status + "', created_on='" + dat + "' WHERE user_id=" + userId;
	connection.query(sql, function (err, success) {
		if (err)
			throw err
		if (success) {
			console.log(success.insertId)
			return true;
		}
	});
}

exports.userIDChk = function (id, callback) {
	var sql = "select * from users where user_id ='" + id + "'";
	connection.query(sql, function (err, rows) {
		if (err) throw err
		callback(null, rows);
	});
}

exports.userIDExistingChk = function (credentials, callback) {
	var sql = "select * from users where user_email= '" + credentials.fields.user_email + "' and user_id !='" + credentials.userId + "'";
	connection.query(sql, function (err, rows) {
		if (err) throw err
		callback(null, rows);
	});
}

// exports.getdata = function (criteria, callback) {
// 	var results = [];
// 	var sql_query = "SELECT * from theurapetic_areas";
// 	var query = connection.query(sql_query);
// 	query.on('error', function (err) {
// 		console.log('Database error!', err);
// 	});
// 	query.on('row', (row) => {
// 		results.push(row);
// 	});
// 	query.on("end", function () {
// 		connection.end();
// 		callback(null, results);
// 	});

// }

// function setdata(from_data) {
// 	var set_data = '';
// 	for (var key in from_data) {
// 		if (from_data.hasOwnProperty(key)) {
// 			set_data += key + "='" + from_data[key] + "'" + " ,";
// 		}
// 	}

// 	return set_data.replace(/,\s*$/, "");;

// }

exports.passwordChange = function (passdata, userId) {
	// var _fromdata = setdata(data);
	// var randomstring = Math.random().toString(36).slice(-8);
	// console.log("randomstring: ", randomstring); // login through this string

	// var passdata = crypto.createHash('md5').update(randomstring).digest('hex');
	console.log("passdata2: ", passdata);
	console.log("userId: ", userId);

	var sql = "update " + _table + " set user_password='" + passdata + "' WHERE user_id=" + userId;
	console.log("insert: ", sql);
	connection.query(sql, function (err, success) {
		if (err)
			throw err
		if (success) {
			console.log(success.insertId);
			return true;
		}
	});
}