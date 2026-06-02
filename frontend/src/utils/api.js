import axios from 'axios';

export async function analyzeAnswer({ question, answer, type }) {
  const key = process.env.REACT_APP_GEMINI_KEY;

  if (!key) {
    throw new Error('No Gemini API key found');
  }

  const prompt = `
You are an expert AI interview coach. Evaluate this interview response.

Interview Type: ${type}
Question: "${question}"
Candidate Answer: "${answer}"

Respond ONLY with this exact JSON format (no markdown, no backticks):
{
  "confidence": <integer between 0-100>,
  "communication": <integer between 0-100>,
  "technical": <integer between 0-100>,
  "feedback": "<2-3 sentence constructive feedback>",
  "suggestion": "<one specific actionable tip>"
}`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      }
    );

    const raw = response.data.candidates[0].content.parts[0].text;
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);

  } catch (err) {
    // Retry with gemini-2.0-flash if 2.5 fails
    if (err.response?.status === 429 || err.response?.status === 404) {
      const retry = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        }
      );
      const raw = retry.data.candidates[0].content.parts[0].text;
      const cleaned = raw.replace(/```json|```/g, '').trim();
      return JSON.parse(cleaned);
    }
    throw err;
  }
}

export async function getSessions() {
  return [];
}