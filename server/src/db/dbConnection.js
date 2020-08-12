const mysql = require('mysql');

module.exports = () => {
  return mysql.createConnection({
    host: '192.168.100.36',
    port: 3306,
    user: 'root',
    password: 'admin123',
    database: 'covid_reports'
  });
}
