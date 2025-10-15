import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import { GoogleGenerativeAI } from '@google/generative-ai';

const PDF_WORKER_SRC = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
const MAX_PROMPT_CHARS = 15000;

if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;
}

const MODEL_NAME = 'gemini-1.5-flash-latest';

function getGenerativeModel() {
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('Missing Google Gemini API key. Please set REACT_APP_GOOGLE_API_KEY in your environment.');
  }

  const client = new GoogleGenerativeAI(apiKey);
  return client.getGenerativeModel({ model: MODEL_NAME });
}

async function extractTextFromDocx(file) {
  const arrayBuffer = await file.arrayBuffer();
  const { value } = await mammoth.extractRawText({ arrayBuffer });
  return value;
}

async function extractTextFromPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const typedArray = new Uint8Array(arrayBuffer);
  const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

  let textContent = '';

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ');
    textContent += `${pageText}\n`;
  }

  return textContent;
}

function selectExtractor(file) {
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension === 'docx') {
    return extractTextFromDocx;
  }
  if (extension === 'pdf') {
    return extractTextFromPdf;
  }
  throw new Error('Unsupported file type. Please upload a DOCX or PDF file.');
}

function buildPrompt(rawText, institution) {
  const truncatedText = rawText.length > MAX_PROMPT_CHARS ? `${rawText.slice(0, MAX_PROMPT_CHARS)}...` : rawText;

  return `You are an assistant that reads weekly menu documents and normalises them to JSON.\nInstitution: ${institution.toUpperCase()}\n---\nDocument:\n${truncatedText}\n---\nReturn valid JSON in the following shape:\n{\n  "institution": "imh" | "idss",\n  "weekOf": "YYYY-MM-DD" | null,\n  "days": [\n    {\n      "day": "Monday",\n      "meals": [\n        { "name": "", "time": "", "description": "" }\n      ]\n    }\n  ],\n  "notes": []\n}\nDo not include any commentary or code fences. Ensure keys are always present even if arrays are empty.`;
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

export async function processMenuFile(file, institution) {
  const extractor = selectExtractor(file);
  const rawText = await extractor(file);
  if (!rawText.trim()) {
    throw new Error('The uploaded file did not contain readable text.');
  }

  const prompt = buildPrompt(rawText, institution);
  const model = getGenerativeModel();
  let result;
  try {
    result = await model.generateContent(prompt);
  } catch (error) {
    throw new Error(`Gemini API request failed: ${error.message}`);
  }

  const responseText = result?.response?.text();
  const structuredMenu = sanitiseToJson(responseText);

  return {
    ...structuredMenu,
    institution,
    sourceFileName: file.name,
    generatedAt: new Date().toISOString(),
  };
}