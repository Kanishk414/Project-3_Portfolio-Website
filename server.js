// Importing required Modules
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Initializinf the Express App
const app = express();
const port = process.env.PORT || 3000;

// Setting up Middleware
app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

// MySQL connection configuration using connection URL
const db = mysql.createConnection('mysql://info_reachtried:03251e86ca84825d9abe0262292b879971198e20@dv7.h.filess.io:3307/info_reachtried');

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// API endpoint to handle form submission
app.post('/api/contact', (req, res) => {
  const { fullName, email, mobileNumber, message } = req.body;
    // checking if the table is empty
  db.query('SELECT COUNT(*) as count FROM contacts', (err, results) => {
    if (err) {
      console.error('Error checking table:', err);
      res.status(500).json({ error: 'An error occurred while checking the table' });
      return;
    }

    const isEmpty = results[0].count === 0;

    if (isEmpty) {
      resetAutoIncrement('contacts', (resetErr) => {
        if (resetErr) {
          res.status(500).json({ error: 'An error occurred while resetting auto-increment' });
          return;
        }
        insertContact();
      });
    } else {
      insertContact();
    }
  });
    // Contact information into the database
  function insertContact() {
    const sql = 'INSERT INTO contacts (full_name, email, mobile_number, message) VALUES (?, ?, ?, ?)';
    db.query(sql, [fullName, email, mobileNumber, message], (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'An error occurred while submitting the form: ' + err.message });
        return;
      }
      console.log('Data inserted successfully');
      res.status(200).json({ message: 'Will contact you soon!' });
    });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke on the server: ' + err.message);
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Starting the server
app.listen(port, () => {
  console.log(`Server running on https://developers-portfolio-production.up.railway.app${port}`);
});
// Resetting auto-Increment 
function resetAutoIncrement(tableName, callback) {
  const resetQuery = `ALTER TABLE ${tableName} AUTO_INCREMENT = 1`;
  db.query(resetQuery, (err, result) => {
    if (err) {
      console.error('Error resetting auto-increment:', err);
      callback(err);
    } else {
      console.log(`Auto-increment reset for table ${tableName}`);
      callback(null);
    }
  });
}
