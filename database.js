const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

db.serialize(() => {
  // Create Client table
  db.run(`CREATE TABLE clients (
    ssn TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    balance REAL NOT NULL
  )`);

  // Create Products table
  db.run(`CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL
  )`);
  // Add sample data to tables
  db.run(`INSERT INTO clients (ssn, name, age, balance) VALUES ('3020', 'youssef', 20, 1000)`);
  db.run(`INSERT INTO products (name, price, quantity) VALUES ('Tshirt M', 60, 50 )`);
  db.run(`INSERT INTO products (name, price, quantity) VALUES ('Tshirt S', 40, 100 )`);
});

module.exports = db;