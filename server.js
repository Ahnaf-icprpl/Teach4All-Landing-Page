const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static assets from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Main landing page route
app.get('/', (req, res) => {
  res.render('index', {
    title: 'TEACH FOR ALL — Asisten Belajar AI Tanpa Batas Sinyal'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`TEACH FOR ALL server running on http://localhost:${PORT}`);
});
