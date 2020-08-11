const mysql = require('mysql');

module.exports = () => {
  return mysql.createConnection({
    host: '192.168.100.36',
    //host: 'db', process.env.DATABASE_HOST || '127.0.0.1'//Para container
    port: 3306,
    user: 'root',
    password: 'admin123',
    // password: 'admin123', //Para container
    database: 'covid_reports'
  });
}
