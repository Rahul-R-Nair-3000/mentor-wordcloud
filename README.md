# Mentor Wordcloud

An AI-powered web application that converts recorded or uploaded mentorship feedback audio sessions into interactive word clouds, extracted key topics, and transcripts.

## What's built and what works

- **Browser Audio Recording**: Real-time microphone capture using the MediaRecorder API with live elapsed timer display, playback scrubber for review before committing, a Discard option, and explicit error handling for microphone permissions (`NotAllowedError`) and missing hardware devices (`NotFoundError`).
- **Audio File Upload**: File picker and drag-and-drop dropzone supporting MP3, WAV, M4A, AAC, OGG, WEBM, and FLAC formats with client-side and server-side size limit validation (`BRIEF_REF_5190_MAX_BYTES` capped at 25 MB).
- **Backend Express API**: Multipart file upload processing using Multer (`POST /api/analyze`) capped at 25 MB.
- **Groq AI Pipeline**:
  - Audio transcription via Groq's `whisper-large-v3-turbo` model.
  - Term extraction, stopword filtering, variant merging, and frequency weighting via `llama-3.1-8b-instant` with structured JSON output formatting.
  - Zod schema validation for LLM responses with server-side error logging and generic HTTP 502 error masking.
- **Tabbed Result Interface**: Interactive visual word cloud, top frequency topic metrics table with percentages, and transcript panel responsive at both desktop and 390px mobile viewports.
- *Note on PNG Export*: PNG export was attempted using `html2canvas`, but it is not working reliably across all browser rendering contexts and DOM layouts.

## Run it locally

```bash
# 1. Clone the repository
git clone https://github.com/Rahul-R-Nair-3000/mentor-wordcloud.git
cd mentor-wordcloud

# 2. Configure environment variables in server/.env
echo "GROQ_API_KEY=your_groq_api_key_here" > server/.env

# 3. Build both client and server
npm run build

# 4. Start the production server
npm start
```

For development mode with hot module reloading:

```bash
# Terminal 1 (Backend Express server on port 3001)
npm run dev --prefix server

# Terminal 2 (Frontend Vite dev server on port 5173 with proxy)
npm run dev --prefix client
```

## Environment variables

- `GROQ_API_KEY`: API key for Groq Cloud services, used server-side for Whisper transcription and Llama LLM term extraction. Read exclusively from `process.env` in `server/.env` and never exposed to the client.

## AI service and why

- **Groq**: Used `whisper-large-v3-turbo` for audio transcription and `llama-3.1-8b-instant` for term extraction and prominence weighting.
- **Why**: Selected for Groq's fast LPU inference speeds, generous free tier, and single-provider simplicity without needing separate Speech-to-Text and LLM vendors.

## Key decisions and trade-offs

- **Render over Vercel**: Deployed on Render as a persistent Node.js web service rather than Vercel serverless functions because Vercel imposes a strict 4.5 MB request body limit on serverless functions, which blocks our 25 MB audio upload requirement (`BRIEF_REF_5190_MAX_BYTES`).
- **Single Node service serving frontend & backend**: Express serves the static React production client build (`client/dist`) alongside `/api/analyze` routes, simplifying deployment and avoiding CORS issues in production.
- **Responsive Tag Cloud vs d3-cloud/canvas**: Implemented a responsive flex-wrap CSS tag cloud using Tailwind CSS to guarantee fast, fluid rendering across all screen sizes (desktop to 390px mobile) without canvas font-loading latency.

## Libraries used

- `express`: Fast Node.js web application framework.
- `multer`: Middleware for handling `multipart/form-data` file uploads.
- `groq-sdk`: Official Groq Cloud SDK for transcription and chat completions.
- `zod`: TypeScript-first schema declaration and validation library.
- `html2canvas`: HTML to Canvas rendering library (attempted for PNG export).
- `Tailwind CSS`: Modern utility-first CSS framework for responsive UI styling.

## AI coding tools used

Claude and Google Antigravity were used throughout for architecture, debugging, and implementation.

## What I'd do next with another week

- Fix and stabilize PNG / SVG export using a dedicated server-side canvas renderer or inline SVG text generator.
- Implement speaker diarization to separate mentor vs. mentee feedback streams.
- Add session history persistence with database storage (e.g. PostgreSQL / Supabase).
- Implement PDF report exports summarizing feedback themes and actionable items.

Brief ref: TFG-WD-4417
