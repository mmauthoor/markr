const { Pool } = require('pg');

const pool = new Pool({
    database: "markr"
})

module.exports = pool;
