const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express(); // Initialize express

// Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Middleware to parse the request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // To handle JSON data

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Define a schema and model for storing contact form submissions
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String
});

const Contact = mongoose.model('Contact', contactSchema);

// Route to handle contact form submissions
app.post('/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  // Basic validation (optional)
  if (!name || !email || !message) {
    return res.status(400).send('Please fill out all required fields.');
  }

  // Save to the database
  const contact = new Contact({ name, email, phone, message });
  try {
    await contact.save();
    res.send('<h1>Thank you for contacting us!</h1><a href="/">Go back to homepage</a>');
  } catch (err) {
    // Provide more specific error messages based on error type
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(400).send('Invalid input data. Please check your submission.');
    } else {
      return res.status(500).send('Failed to submit your message. Please try again later.');
    }
  }
});

// Route to handle the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Routes for other pages
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/service', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'services.html'));
});

app.get('/gallery', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'gallery.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
