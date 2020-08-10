const mysql = require('mysql');

module.exports = () => {
  return mysql.createConnection({
    host: '192.168.100.36',
    //host: 'db', //Para container
    port: 3306,
    user: 'root',
    password: 'admin123',
    // password: 'admin123', //Para container
    database: 'covid_reports'
  });
}
