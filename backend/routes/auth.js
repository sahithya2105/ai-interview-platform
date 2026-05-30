const express = require('express');
const router  = express.Router();

// Placeholder — wire up Firebase Auth here
router.post('/login', (req, res) => {
  res.json({ message: 'Use Firebase Auth on the frontend.' });
});

router.post('/register', (req, res) => {
  res.json({ message: 'Use Firebase Auth on the frontend.' });
});

module.exports = router;