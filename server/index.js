import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Resolve directory path cleanly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const responsesPath = path.join(__dirname, 'responses.json');

app.use(cors());
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Harald backend active' });
});

// Chat endpoint matching user input against responses.json
app.post('/api/chat', (req, res) => {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message text is required.' });
    }

    try {
        const rawData = fs.readFileSync(responsesPath, 'utf-8');
        const data = JSON.parse(rawData);
        const userText = message.toLowerCase();

        let bestMatch = null;
        let highestScore = 0;

        for (const topic of data.topics) {
            let score = 0;
            for (const keyword of topic.keywords) {
                if (userText.includes(keyword.toLowerCase())) {
                    score += 1;
                }
            }
            if (score > highestScore) {
                highestScore = score;
                bestMatch = topic;
            }
        }

        const reply = bestMatch ? bestMatch.reply : data.fallback;
        res.json({ reply, matchedTopic: bestMatch ? bestMatch.id : 'fallback' });
    } catch (err) {
        console.error('Error reading responses.json:', err);
        res.status(500).json({ error: 'Failed to read historical records.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});