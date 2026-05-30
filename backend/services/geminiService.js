const axios = require('axios');

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;

async function analyzeWithGemini(prompt) {
  const res = await axios.post(GEMINI_URL, {
    contents: [{ parts: [{ text: prompt }] }],
  });
  const raw  = res.data.candidates[0].content.parts[0].text;
  const json = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(json);
}

module.exports = { analyzeWithGemini };