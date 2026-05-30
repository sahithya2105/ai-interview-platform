const express = require('express');
const router  = express.Router();

// In-memory store (replace with Firebase/MongoDB for persistence)
let sessions = [];

router.post('/', (req, res) => {
  const session = { id: Date.now().toString(), ...req.body, createdAt: new Date() };
  sessions.push(session);
  res.status(201).json(session);
});

router.get('/', (req, res) => {
  res.json(sessions.slice(-10).reverse());
});

router.get('/:id', (req, res) => {
  const session = sessions.find((s) => s.id === req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found.' });
  res.json(session);
});

module.exports = router;