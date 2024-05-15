// db.js

import mysql from 'mysql';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'devstack'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to database');
  }
});

export default db;
