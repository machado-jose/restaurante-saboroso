// get the client
const mysql = require('mysql2');
 
// create the connection to database
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'saboroso',
  password: 'root'
});

module.exports = conn;