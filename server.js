const express = require('express');
const path = require('path');
const { clerkMiddleware, getAuth } = require('@clerk/express');

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

// Clerk authentication middleware
if (process.env.CLERK_PUBLISHABLE_KEY) {
  app.use(clerkMiddleware());
} else {
  console.warn('[Clerk] Notice: CLERK_PUBLISHABLE_KEY is not set. Add it to .env or .env.local to activate Clerk auth.');
}

// Main landing page route
app.get('/', (req, res) => {
  res.render('index', {
    title: 'TEACH FOR ALL — Asisten Belajar AI dengan Koneksi Minimal',
    clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY || ''
  });
});

// Terms of Service route
app.get(['/terms', '/tos', '/syarat-ketentuan'], (req, res) => {
  res.render('terms', {
    title: 'Syarat & Ketentuan (Terms of Service) — TEACH FOR ALL',
    clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY || ''
  });
});

// Privacy Policy route
app.get(['/privacy', '/privacy-policy', '/kebijakan-privasi'], (req, res) => {
  res.render('privacy', {
    title: 'Kebijakan Privasi (Privacy Policy) — TEACH FOR ALL',
    clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY || ''
  });
});

// Protected user profile route example
app.get('/api/me', (req, res) => {
  if (!process.env.CLERK_PUBLISHABLE_KEY) {
    return res.status(503).json({ error: 'Clerk auth is not configured yet. Please set CLERK_PUBLISHABLE_KEY in .env.' });
  }
  const auth = getAuth(req);
  if (!auth.userId) {
    return res.status(401).json({ error: 'Unauthorized. Please sign in.' });
  }
  res.json({ userId: auth.userId, sessionId: auth.sessionId });
});

// Start server
app.listen(PORT, () => {
  console.log(`TEACH FOR ALL server running on http://localhost:${PORT}`);
});
