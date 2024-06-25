const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// MySQL connection configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'yourusername',
  password: 'yourpassword',
  // In my case the database i used is info .
  database: 'info'
});
//---------------------------------------------------------------
// This is the table command which I used to create table in database 
// CREATE TABLE contacts (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     full_name VARCHAR(255) NOT NULL,
//     email VARCHAR(255) NOT NULL,
//     mobile_number VARCHAR(20) NOT NULL,
//     message TEXT NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//   );
//--------------------------------------------------------------
// Connect to MySQL
db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL database');
  });
// API endpoint to handle form submissio
app.post('/api/contact', (req, res) => {
    const { fullName, email, mobileNumber, message } = req.body;
  
    console.log('Received data:', { fullName, email, mobileNumber, message });
  
    const sql = 'INSERT INTO contacts (full_name, email, mobile_number, message) VALUES (?, ?, ?, ?)';
    console.log('Executing SQL:', sql);
    console.log('With values:', [fullName, email, mobileNumber, message]);
  
    db.query(sql, [fullName, email, mobileNumber, message], (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'An error occurred while submitting the form: ' + err.message });
        return;
      }
      console.log('Data inserted successfully, result:', result);
      res.status(200).json({ message: 'Form submitted successfully' });
    });
  });
  
  // Add this error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke on the server: ' + err.message);
  });

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });