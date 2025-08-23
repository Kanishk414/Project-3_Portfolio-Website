const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Basics & security
app.set('trust proxy', 1);
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

let pool; // we'll assign after DB creation

// --- Ensure DB and Schema ---
async function initDatabase() {
  const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

  // Step 1: connect without database
  const connection = await mysql.createConnection({
    host: MYSQL_HOST,
    port: MYSQL_PORT || 3306,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
  });

  // Step 2: create DB if not exists
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\``);
  console.log(`✅ Database ensured: ${MYSQL_DATABASE}`);
  await connection.end();

  // Step 3: create pool with DB
  pool = mysql.createPool({
    host: MYSQL_HOST,
    port: MYSQL_PORT || 3306,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
  });

  // Step 4: create table if not exists
  const sql = `
    CREATE TABLE IF NOT EXISTS contact_messages (
      id BIGINT PRIMARY KEY AUTO_INCREMENT,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL,
      mobile_number VARCHAR(30),
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  const conn = await pool.getConnection();
  try {
    await conn.query(sql);
    console.log("✅ Table ensured: contact_messages");
  } finally {
    conn.release();
  }
}

// --- Routes ---
app.get('/api/health', async (req, res) => {
  try {
    const c = await pool.getConnection();
    await c.ping();
    c.release();
    res.json({ ok: true, db: 'up' });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

const limiter = rateLimit({ windowMs: 60 * 1000, max: 20 });

app.post('/api/contact', limiter, async (req, res) => {
  const { fullName, email, mobileNumber, message } = req.body || {};
  if (!fullName || !email || !message) {
    return res.status(400).json({ ok: false, error: 'fullName, email, and message are required.' });
  }

  try {
    const sql = `INSERT INTO contact_messages (full_name, email, mobile_number, message)
                 VALUES (?, ?, ?, ?)`;
    const params = [
      String(fullName).trim(),
      String(email).trim(),
      mobileNumber ? String(mobileNumber).trim() : null,
      String(message).trim(),
    ];
    const conn = await pool.getConnection();
    try {
      await conn.execute(sql, params);
    } finally {
      conn.release();
    }
    res.json({ ok: true, message: 'Will contact you soon!' });
  } catch (err) {
    console.error('❌ Error saving contact:', err);
    res.status(500).json({ ok: false, error: 'Failed to submit the form.' });
  }
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Boot ---
initDatabase().then(() => {
  app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
}).catch(err => {
  console.error('❌ Database init failed:', err);
  process.exit(1);
});
