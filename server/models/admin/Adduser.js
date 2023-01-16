const connection = require('./../../config/database-admin');
var crypto = require('crypto');
var session = require('express-session');
const _table='users';
exports.save=function(data=null){
    //var _fromdata= setdata(data);
  console.log(data.user_name);
  var add_date = require('current-date');var dat =add_date('date');;
  var passdata = crypto.createHash('md5').update(data.user_pwd).digest('hex');
  var create_admin_id = data.user_id;
  var sql="insert into "+ _table +"(user_name,user_email,user_pwd,client_id,user_type,created_on,created_by,user_status,deleted)  values ('"+data.user_name+"','"+data.user_email+"','"+passdata+"','"+data.client_id+"','"+data.user_type+"','"+dat+"','"+create_admin_id+"',0,0)";
  console.log(sql);
  connection.query(sql,function(err,success){
 	         	if (err)
	                throw err
				 if (success) {
				 	console.log(success.insertId)
	                 return true;
	            }
	           		
	});
}



function setdata(from_data) {
    var set_data='';
    for (var key in from_data) {
        if (from_data.hasOwnProperty(key)) {
           set_data += key+"='"+ from_data[key] +"'" +" ,";
        }
    }
    
    return  set_data.replace(/,\s*$/, "");;

}