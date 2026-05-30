require('dotenv').config();
const express     = require('express');
const cors        = require('cors');
const rateLimit   = require('express-rate-limit');

const interviewRoutes = require('./routes/interview');
const resultsRoutes   = require('./routes/results');
const authRoutes      = require('./routes/auth');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '2mb' }));

// Rate limiting
const limiter = rateLimit({ windowMs: 60_000, max: 30 });
app.use('/api/', limiter);

// Routes
app.use('/api/interview', interviewRoutes);
app.use('/api/results',   resultsRoutes);
app.use('/api/auth',      authRoutes);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));