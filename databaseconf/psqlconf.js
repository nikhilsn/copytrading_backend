const { Pool } = require('pg');

var pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'copytrading',
    password: 'admin',
    port: 5432,
});

module.exports = pool;