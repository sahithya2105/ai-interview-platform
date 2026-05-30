import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'https://ai-interview-backend-rar0.onrender.com';

const api = axios.create({ baseURL: BASE_URL });

export async function analyzeAnswer({ question, answer, type }) {
  try {
    const res = await api.post('/api/interview/analyze', { question, answer, type });
    return res.data;
  } catch (err) {
    // Fallback: call Gemini directly from frontend (if REACT_APP_GEMINI_KEY is set)
    const key = process.env.REACT_APP_GEMINI_KEY;
    if (!key) throw err;

    const prompt = `
You are an AI interview coach. Evaluate this interview answer.
Question: "${question}"
Answer: "${answer}"
Interview Type: ${type}

Respond ONLY with a JSON object like:
{
  "confidence": <0-100>,
  "communication": <0-100>,
  "technical": <0-100>,
  "feedback": "<2-3 sentence feedback>",
  "suggestion": "<1 actionable tip>"
}`;

    const gemRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );

    const raw  = gemRes.data.candidates[0].content.parts[0].text;
    const json = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(json);
  }
}

export async function getSessions() {
  const res = await api.get('/api/results');
  return res.data;
}