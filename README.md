# weekly-menu

Weekly Menu for IMH/IDSS

## Environment

Create a `.env` file with your Google Gemini key before running the app:

```env
GEMINI_API_KEY=YOUR_KEY_HERE
MODEL_NAME=gemini-2.5-flash
```

## Development

Run the development stack (backend proxy + React client):

```bash
npm run dev
```

The backend keeps the API key server-side; avoid exposing it directly in the browser.
