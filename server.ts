import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import natural from 'natural';

const app = express();
const PORT = 3000;
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// --- ANALYSIS ENDPOINT ---
app.post('/api/analyze', async (req, res) => {
  try {
    const { resumeText, jdText } = req.body;
    if (!resumeText || !jdText) {
      return res.status(400).json({ error: "Missing resume or job description" });
    }

    const apiKey = process.env.GEMINI_API_KEY1 || process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "AI Studio Free Tier") {
      return res.status(500).json({ 
        error: "Gemini API Key is missing or invalid. Please ensure your secret 'GEMINI_API_KEY1' contains your valid API key." 
      });
    }

    const { GoogleGenAI, Type } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Analyze the following resume against the job description.
    
    RESUME:
    ${resumeText}
    
    JOB DESCRIPTION:
    ${jdText}
    
    Provide a detailed analysis in JSON format.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchScore: { type: Type.INTEGER },
            scoreTitle: { type: Type.STRING },
            scoreDescription: { type: Type.STRING },
            resumeRating: { type: Type.NUMBER },
            resumeRatingLabel: { type: Type.STRING },
            resumeRatingJustification: { type: Type.STRING },
            matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            sectionScores: { 
              type: Type.OBJECT,
              properties: {
                "Skills": { type: Type.INTEGER },
                "Experience": { type: Type.INTEGER },
                "Education": { type: Type.INTEGER },
                "Keywords": { type: Type.INTEGER },
                "Formatting": { type: Type.INTEGER }
              }
            },
            roleImprovements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  priority: { type: Type.STRING },
                  category: { type: Type.STRING },
                  title: { type: Type.STRING },
                  detail: { type: Type.STRING },
                  impact: { type: Type.STRING }
                }
              }
            },
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  title: { type: Type.STRING },
                  body: { type: Type.STRING }
                }
              }
            },
            atsScore: { type: Type.INTEGER },
            atsChecks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  passed: { type: Type.BOOLEAN },
                  note: { type: Type.STRING }
                }
              }
            },
            resumeKeywords: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  weight: { type: Type.INTEGER }
                }
              }
            },
            jdKeywords: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  weight: { type: Type.INTEGER }
                }
              }
            }
          },
          required: [
            'matchScore', 'scoreTitle', 'scoreDescription', 'resumeRating', 
            'resumeRatingLabel', 'resumeRatingJustification', 'matchedSkills', 
            'missingSkills', 'sectionScores', 'roleImprovements', 'suggestions', 
            'atsScore', 'atsChecks', 'resumeKeywords', 'jdKeywords'
          ]
        }
      }
    });

    if (!response.text) {
      throw new Error("Empty response from AI");
    }

    res.json(JSON.parse(response.text));
  } catch (error: any) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// --- VITE MIDDLEWARE ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
