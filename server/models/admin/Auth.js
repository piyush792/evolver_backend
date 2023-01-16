'use strict';

const db = require('./../config/database-admin');
const connection =db.connection;

exports.index = function (where, callback) {
  // var result = [];
  var rows = [];

  connection.query('SELECT * from products order by id', function (err, rows) {
    if (err) throw err
    callback(null, rows);
  });

  // var sql_query = "SELECT * from products order by id";
  // console.log(sql_query);  
  // var query = connection.query(sql_query);


  // query.on('error', (err) => {
  //   console.log('Database error!', err);
  // });
  // query.on('row', function (row) {
  //   rows.push(row);
  // });
  // query.on("end", function () {
  //   //connection.end();
  //   //callback(null, { eventTypeData: eventTypeData });
  //   callback(null, rows);
  // });
}
