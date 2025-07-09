const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

// Init Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

// Sequelize MySQL Setup
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

// Contact model
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

// Contact form API
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

// 🔍 Health check route
app.get('/health', (req, res) => {
  res.send('✅ Server is healthy');
});

// 🧠 Favicon fix (prevents 502 from /favicon.ico)
app.get('/favicon.ico', (req, res) => res.sendStatus(204));

// Catch-all: Serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.resolve(publicPath, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).send('Server error: ' + err.message);
});

// Start server after DB is ready
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL database');

    await sequelize.sync();
    console.log('✅ Contacts table synced');

    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (err) {
    console.error('❌ Startup error:', err);
    process.exit(1);
  }
})();
