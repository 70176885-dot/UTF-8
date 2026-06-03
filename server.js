import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Setup for ES modules __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize the Gemini API client
// It automatically looks for the GEMINI_API_KEY environment variable
const ai = new GoogleGenAI({});

app.use(express.json());
app.use(express.static(__dirname));

// Serve the index.html file on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Format history for the Gemini API if you want to expand to multi-turn later, 
        // but for a simple chat we can generate content directly or use a model.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // Fast and highly capable model
            contents: message,
        });

        res.json({ reply: response.text });
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        res.status(500).json({ error: "Something went wrong on the server." });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
