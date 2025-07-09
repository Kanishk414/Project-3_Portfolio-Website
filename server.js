const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Connection Setup
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialect: 'mysql',
    logging: false,
  }
);

// Test DB connection
sequelize.authenticate()
  .then(() => console.log('✅ Connected to MySQL database'))
  .catch((err) => console.error('❌ MySQL connection failed:', err));

// Define Contact Model
const Contact = sequelize.define('Contact', {
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobileNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
  tableName: 'contacts',
  timestamps: false,
});

// Sync the model with DB
sequelize.sync()
  .then(() => console.log('✅ Contacts table synced'))
  .catch((err) => console.error('❌ Failed to sync table:', err));

// Contact form submission endpoint
app.post('/api/contact', async (req, res) => {
  const { fullName, email, mobileNumber, message } = req.body;

  try {
    await Contact.create({ fullName, email, mobileNumber, message });
    console.log('✅ New contact saved');
    res.status(200).json({ message: 'Will contact you soon!' });
  } catch (error) {
    console.error('❌ Error saving contact:', error);
    res.status(500).json({ error: 'Something went wrong while submitting the form.' });
  }
});

// Catch-all route to serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`Server error: ${err.message}`);
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running at https://kanishk.up.railway.app:${port}`);
});
