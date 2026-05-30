const express = require('express');
const axios   = require('axios');
const router  = express.Router();

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`;

router.post('/analyze', async (req, res) => {
  const { question, answer, type } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ error: 'question and answer are required.' });
  }

  const prompt = `
You are an expert AI interview coach. Evaluate the following interview response.

Interview Type: ${type || 'general'}
Question: "${question}"
Candidate Answer: "${answer}"

Analyze and respond ONLY with valid JSON (no markdown, no extra text):
{
  "confidence": <integer 0-100>,
  "communication": <integer 0-100>,
  "technical": <integer 0-100>,
  "feedback": "<2-3 sentence constructive feedback>",
  "suggestion": "<one specific actionable improvement tip>"
}`;

  try {
    const geminiRes = await axios.post(GEMINI_URL, {
      contents: [{ parts: [{ text: prompt }] }],
    });

    const raw  = geminiRes.data.candidates[0].content.parts[0].text;
    const json = raw.replace(/```json|```/g, '').trim();
    const data = JSON.parse(json);
    return res.json(data);
  } catch (err) {
    console.error('Gemini error:', err.response?.data || err.message);
    return res.status(500).json({ error: 'AI analysis failed.' });
  }
});

router.get('/questions/:type', (req, res) => {
  const QUESTIONS = {
    hr: [
      'Tell me about yourself and your background.',
      'What is your greatest professional strength?',
      'Describe a time you handled a conflict at work.',
      'Where do you see yourself in 5 years?',
      'Why do you want to work at our company?',
    ],
    technical: [
      'Explain the difference between REST and GraphQL APIs.',
      'What are the SOLID principles in software design?',
      'How does garbage collection work in JavaScript?',
      'Explain the CAP theorem in distributed systems.',
      'What is the difference between SQL and NoSQL databases?',
    ],
    coding: [
      'Write a function to reverse a string without using built-in methods.',
      'Implement a binary search algorithm.',
      'Find the longest substring without repeating characters.',
      'Write a function to check if a number is prime.',
      'Implement a stack using two queues.',
    ],
    aptitude: [
      'A train travels 120 km in 2 hours. What is its speed in m/s?',
      'If 15 workers finish a job in 8 days, how many days for 10 workers?',
      'Find the next number in the series: 2, 6, 12, 20, 30, ?',
      'A shopkeeper sells at 20% profit. If cost is ₹500, selling price is?',
      'What is the probability of getting a head when a fair coin is tossed?',
    ],
  };

  const q = QUESTIONS[req.params.type];
  if (!q) return res.status(404).json({ error: 'Unknown interview type.' });
  res.json({ questions: q });
});

module.exports = router;