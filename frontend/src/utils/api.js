import axios from 'axios';

export async function analyzeAnswer({ question, answer, type }) {
  const key = process.env.REACT_APP_GEMINI_KEY;

  if (!key) {
    throw new Error('No Gemini API key found');
  }

  const prompt = `You are an expert AI interview coach. Evaluate this interview response.

Interview Type: ${type}
Question: "${question}"
Candidate Answer: "${answer}"

Respond ONLY with this exact JSON (no markdown, no backticks, no extra text):
{"confidence":75,"communication":80,"technical":70,"feedback":"Your feedback here in 2-3 sentences.","suggestion":"One specific tip here."}`;

  const models = [
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash',
    'gemini-1.0-pro',
  ];

  for (const model of models) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
          }
        }
      );

      const raw = response.data.candidates[0].content.parts[0].text;
      const cleaned = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      return parsed;

    } catch (err) {
      console.log(`Model ${model} failed, trying next...`);
      if (model === models[models.length - 1]) {
        throw err;
      }
    }
  }
}

export async function getSessions() {
  return [];
}