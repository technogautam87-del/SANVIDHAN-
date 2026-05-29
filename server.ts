import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

let aiInstance: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiInstance;
}

// Constitutional Search Grounding API
app.post("/api/constitution/search", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Query is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        text: "नमस्ते मित्र! अभी लाइव सर्च ग्राउंडिंग के लिए जेमिनी कुंजी उपलब्ध नहीं है। कृपया ऐप सेटिंग्स (Settings > Secrets) में 'GEMINI_API_KEY' जोड़ें। इसके बाद मैं सीधे गूगल सर्च ग्राउंडिंग से भारतीय संविधान के ताजा तथ्य खोज सकूँगा! 🔍📚",
        sources: []
      });
    }

    const ai = getGemini();
    const systemPrompt = `You are "Samvidhan Mitra Grounder" (संविधान मित्र खोज सहायक), a friendly educational AI assistant for school children. 
Answer the question/query related to the Constitution of India in simple, inspiring, and child-safe language.
If the query is in Hindi or Devnagari, answer in clear children-friendly Hindi.
You have access to Google Search grounding. Use facts returned about the Constitution to solve their doubt or help them solve quiz questions.
Keep the main response brief (2-3 short paragraphs max). Always be respectful and patriotic.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Search query: "${query}"`,
      config: {
        systemInstruction: systemPrompt,
        tools: [{ googleSearch: {} }],
      },
    });

    const answer = response.text || "सर्च पूरा हुआ पर कोई संतोषजनक उत्तर नहीं मिल सका।";

    // Extract URLs
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .map((c: any) => {
        if (c.web) {
          return {
            title: c.web.title || "भारतीय संविधान स्रोत संदर्भ",
            uri: c.web.uri || "#"
          };
        }
        return null;
      })
      .filter(Boolean);

    return res.json({
      text: answer,
      sources: sources
    });
  } catch (err: any) {
    console.error("Gemini search grounding error:", err);
    return res.json({
      text: "नमस्ते मित्र! खोज को संसाधित करते समय जेमिनी सर्वर से प्रतिक्रिया नहीं मिल पाई है। कृपया सुनिश्चित करें कि 'GEMINI_API_KEY' वैध है। ⚠️",
      sources: []
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
