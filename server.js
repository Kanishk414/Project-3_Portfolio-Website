const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 3306,
  ssl: false   
});


// API: Save contact
app.post('/api/contact', async (req, res) => {
  const { fullName, email, mobileNumber, message } = req.body;

  if (!fullName || !email || !mobileNumber || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const insert = `
      INSERT INTO contacts (fullName, email, mobileNumber, message)
      VALUES (?, ?, ?, ?)
    `;
    await pool.query(insert, [fullName, email, mobileNumber, message]);

    console.log('Contact saved to MySQL');
    res.status(200).json({ message: 'Will contact you soon!' });
  } catch (err) {
    console.error('Error saving contact:', err);
    res.status(500).json({ error: 'Failed to submit the form.' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server error: ' + err.message);
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});

