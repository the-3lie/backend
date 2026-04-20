const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'theking14',
    database: 'memoirefin'
});

module.exports = pool.promise();