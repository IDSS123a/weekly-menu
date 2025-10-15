import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

const PDF_WORKER_SRC = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;
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

export async function processMenuFile(file, institution) {
  const extractor = selectExtractor(file);
  const rawText = await extractor(file);
  if (!rawText.trim()) {
    throw new Error('The uploaded file did not contain readable text.');
  }

  let response;
  try {
    response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: rawText, institution }),
    });
  } catch (error) {
    throw new Error('Unable to reach AI service. Please check your connection and try again.');
  }

  let payload;
  try {
    payload = await response.json();
  } catch (error) {
    throw new Error('Received an invalid response from the AI service.');
  }

  if (!response.ok) {
    throw new Error(payload?.error || 'AI service returned an error.');
  }

  if (!payload?.menu) {
    throw new Error('AI service did not return any menu data.');
  }

  return {
    ...payload.menu,
    institution,
    sourceFileName: file.name,
    generatedAt: new Date().toISOString(),
  };
}