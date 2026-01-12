// const { Pool } = require('pg');
const mysql = require("mysql2");


const DB_PORT = process.env.DB_PORT || 5432;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'user';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'testdb';

// Pool should be instantiated outside the handler to enable connection reuse across invocations
const pool = mysql.createPool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: DB_PORT,
});

const promisePool = pool.promise();
// Use this for queries
module.exports = promisePool;
