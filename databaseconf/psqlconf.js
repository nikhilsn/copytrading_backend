const { Pool } = require('pg');

var pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'copytrading',
    password: 'postgres',
    port: 5432,
});

module.exports = pool;