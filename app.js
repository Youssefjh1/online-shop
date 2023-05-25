const express = require('express');
const app = express();
const db = require('./database');
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    // Fetch all products
    db.all('SELECT * FROM products', (err, products) => {
      if (err) {
        return console.error(err.message);
      }
  
      // Fetch client balance
      db.get('SELECT balance FROM clients WHERE ssn = ?', '001', (err, data) => {
        if (err) {
          return console.error(err.message);
        }
  
        // Pass products and client balance to view
        const clientBalance = data.balance;
        res.render('index', { products, clientBalance });
      });
    });
  });
// Home page displays all products
app.get('/', (req, res) => {
  db.all('SELECT * FROM products', (err, products) => {
    if (err) {
      return console.error(err.message);
    }
    res.render('index', { products });
  });
});

module.exports = db;
// Buy now route
app.get('/buy/:productId', (req, res) => {
  const productId = req.params.productId;

  // Update client balance and product quantity
  db.serialize(() => {
    // Get product price
    db.get(`SELECT price FROM products WHERE id = ?`, productId, (err, data) => {
      if (err) {
        return console.error(err.message);
      }
      const productPrice = data.price;

      // Update client balance
      db.run(`UPDATE clients SET balance = balance - ? WHERE ssn = ?`, [productPrice, '001']);

      // Update product quantity
      db.run(`UPDATE products SET quantity = quantity - 1 WHERE id = ?`, productId);

      res.redirect('/');
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});