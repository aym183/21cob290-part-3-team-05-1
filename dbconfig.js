const mysql = require('mysql');
//local mysql db connection
const dbConn = mysql.createConnection({
 host : 'localhost',
 user : 'teamb005',
 password : 'F8FsNVl3rE',
 database : 'teamb005'
});
dbConn.connect(function(err) {
 if (err) throw err;
 console.log("Database Connected!");
});
module.exports = dbConn;