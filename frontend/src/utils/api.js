import axios from 'axios';

export async function analyzeAnswer({ question, answer, type }) {
  const key = process.env.REACT_APP_GEMINI_KEY;
  
  if (!key) {
    throw new Error('No API key found');
  }

  const prompt = `
You are an expert AI interview coach. Evaluate the following interview response.

Interview Type: ${type}
Question: "${question}"
Candidate Answer: "${answer}"

Respond ONLY with valid JSON (no markdown, no extra text, no backticks):
{
  "confidence": <integer 0-100>,
  "communication": <integer 0-100>,
  "technical": <integer 0-100>,
  "feedback": "<2-3 sentence constructive feedback>",
  "suggestion": "<one specific actionable improvement tip>"
}`;

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
    {
      contents: [{ parts: [{ text: prompt }] }]
    }
  );

  const raw = response.data.candidates[0].content.parts[0].text;
  const cleaned = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

export async function getSessions() {
  return [];
}