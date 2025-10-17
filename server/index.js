const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MODEL_NAME = process.env.MODEL_NAME || 'gemini-2.5-flash';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MAX_PROMPT_CHARS = 15000;

if (!GEMINI_API_KEY) {
  console.error('Missing GEMINI_API_KEY in environment.');
  process.exit(1);
}

app.use(express.json({ limit: '10mb' }));

function buildPrompt(rawText, institution) {
  const truncated = rawText.length > MAX_PROMPT_CHARS
    ? `${rawText.slice(0, MAX_PROMPT_CHARS)}...`
    : rawText;

  return `You are an assistant that reads weekly menu documents and normalises them to JSON.\nInstitution: ${institution.toUpperCase()}\n---\nDocument:\n${truncated}\n---\nReturn valid JSON in the following shape:\n{\n  "institution": "imh" | "idss",\n  "weekOf": "YYYY-MM-DD" | null,\n  "days": [\n    {\n      "day": "Monday",\n      "meals": [\n        { "name": "", "time": "", "description": "" }\n      ]\n    }\n  ],\n  "notes": []\n}\nDo not include any commentary or code fences. Ensure keys are always present even if arrays are empty.`;
}

function sanitiseToJson(rawResponse) {
  if (!rawResponse) {
    throw new Error('Empty response from Gemini API.');
  }

  const trimmed = rawResponse.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Unable to locate JSON in Gemini response.');
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    throw new Error(`Failed to parse JSON response: ${error.message}`);
  }
}

app.post('/api/generate', async (req, res) => {
  const { text, institution = '' } = req.body || {};
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Request body must include a text field.' });
  }

  const prompt = buildPrompt(text, institution);

  const endpoint = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data?.error?.message || 'Gemini API returned an error.';
      return res.status(response.status).json({ error: message, details: data });
    }

    const candidates = data?.candidates || [];
    const parts = candidates[0]?.content?.parts || [];
    const combinedText = parts
      .map((part) => part?.text || '')
      .filter(Boolean)
      .join('\n')
      .trim();

    if (!combinedText) {
      return res.status(502).json({ error: 'Gemini API returned no text content.', details: data });
    }

    const menu = sanitiseToJson(combinedText);
    return res.json({ menu, raw: combinedText });
  } catch (error) {
    console.error('Gemini API error:', error);
    return res.status(500).json({ error: 'Failed to call Gemini API.' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
