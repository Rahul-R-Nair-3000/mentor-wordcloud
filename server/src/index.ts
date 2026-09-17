import path from "path";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import { Groq, toFile } from "groq-sdk";
import { z } from "zod";

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(process.cwd(), "server/.env") });


export const BRIEF_REF_5190_MAX_BYTES = 25 * 1024 * 1024; // 25 MB limit

const app = express();
app.use(cors());

// Configure Multer with memory storage and size limit
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: BRIEF_REF_5190_MAX_BYTES,
  },
});

// Instantiate Groq client using process.env.GROQ_API_KEY
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Zod Schema for LLM Term Extraction Output
const TermSchema = z.object({
  term: z.string().transform((val) => val.toLowerCase()),
  weight: z.number().min(1).max(100),
  count: z.number().nonnegative(),
});

const AnalysisOutputSchema = z.object({
  terms: z.array(TermSchema).max(40),
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Real POST /api/analyze route using Groq AI Pipeline
app.post(
  "/api/analyze",
  upload.single("audio"),
  async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ error: "No audio file uploaded in 'audio' field." });
      return;
    }

    try {
      // Step 1: Audio Transcription via Groq (whisper-large-v3-turbo)
      const filename = req.file.originalname || "recording.webm";
      const mimeType = req.file.mimetype || "audio/webm";

      const fileObj = await toFile(req.file.buffer, filename, { type: mimeType });

      const transcription = await groq.audio.transcriptions.create({
        file: fileObj,
        model: "whisper-large-v3-turbo",
      });

      const transcriptText = transcription.text ? transcription.text.trim() : "";

      // Step 2: Term Extraction via Groq Chat Completions (llama-3.1-8b-instant)
      const systemPrompt = `You are an expert NLP feedback analysis assistant. Analyze the provided feedback transcript and extract the key terms, themes, and concepts.

Return ONLY a JSON object matching this exact structure:
{
  "terms": [
    { "term": string, "weight": number 1-100, "count": number }
  ]
}

Strict Rules:
- All terms must be lowercase.
- Strip filler words, stopwords, and conversational fluff.
- Merge singular/plural and case variants into a single canonical term.
- Drop numbers unless central to the topic.
- Cap at a maximum of 40 terms.
- Weight each term from 1 to 100 based on prominence and importance.
- Calculate or estimate the count of occurrences for each term.
- Output MUST be valid JSON only. Do not include markdown code block wrappers or conversational prose.`;

      let completion;
      try {
        completion = await groq.chat.completions.create({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: transcriptText || "No speech detected in audio." },
          ],
          response_format: { type: "json_object" },
        });
      } catch (modelErr: any) {
        if (modelErr?.status === 404 || modelErr?.error?.error?.code === "model_not_found") {
          console.warn("llama-3.1-8b-instant returned 404, falling back to groq/compound-mini");
          completion = await groq.chat.completions.create({
            model: "groq/compound-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: transcriptText || "No speech detected in audio." },
            ],
            response_format: { type: "json_object" },
          });
        } else {
          throw modelErr;
        }
      }


      const rawModelOutput = completion.choices[0]?.message?.content || "";

      // Step 3: Parse and Validate with Zod
      let parsedJson: unknown;
      try {
        parsedJson = JSON.parse(rawModelOutput);
      } catch (parseErr) {
        console.error("Groq Model JSON Parse Failure:", parseErr);
        console.error("Raw Model Output:", rawModelOutput);
        res.status(502).json({
          error: "AI_PARSE_ERROR",
          message: "Analysis failed, please try again.",
        });
        return;
      }

      const validationResult = AnalysisOutputSchema.safeParse(parsedJson);

      if (!validationResult.success) {
        console.error("Groq Model Output Zod Validation Failure:", validationResult.error);
        console.error("Raw Model Output:", rawModelOutput);
        res.status(502).json({
          error: "AI_PARSE_ERROR",
          message: "Analysis failed, please try again.",
        });
        return;
      }

      // Estimate audio duration in seconds if available or calculate from transcript length
      const durationSec = Math.max(7, Math.round(transcriptText.split(/\s+/).length / 2.5));

      // Step 4: Respond with transcript, terms, and durationSec
      res.json({
        transcript: transcriptText,
        terms: validationResult.data.terms,
        durationSec,
      });
    } catch (groqErr: unknown) {
      console.error("Groq API Error caught on server:", groqErr);
      res.status(502).json({
        error: "AI_SERVICE_ERROR",
        message: "Analysis failed, please try again.",
      });
    }
  }
);

// Express error handler for Multer limits
app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (err && typeof err === "object" && "code" in err) {
    const multerErr = err as { code: string; message: string };
    if (multerErr.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({
        error: `File size exceeds maximum limit of 25 MB (${BRIEF_REF_5190_MAX_BYTES} bytes).`,
      });
      return;
    }
  }
  next(err);
});

// Serve frontend dist assets
app.use(express.static(path.join(__dirname, "../../client/dist")));

app.use((_req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));