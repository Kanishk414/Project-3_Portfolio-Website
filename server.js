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

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
});

app.post('/api/contact', async (req, res) => {
  const { fullName, email, mobileNumber, message } = req.body;

  if (!fullName || !email || !mobileNumber || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const query = `
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fullName VARCHAR(255),
        email VARCHAR(255),
        mobileNumber VARCHAR(20),
        message TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);

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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server error: ' + err.message);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at https://kanishk.up.railway.app:${port}`);
});
