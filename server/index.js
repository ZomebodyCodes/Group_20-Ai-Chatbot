const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const responsesPath = path.join(__dirname, 'responses.json');

app.use(cors());
app.use(express.json());

// Helper to read responses.json fresh on each request
function loadResponses() {
    const raw = fs.readFileSync(responsesPath, 'utf-8');
    return JSON.parse(raw);
}

// POST /api/chat — Match user input against keywords in responses.json
app.post('/api/chat', (req, res) => {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'A message string is required.' });
    }

    try {
        const data = loadResponses();
        const cleanedInput = message.toLowerCase().trim();

        let bestMatch = null;
        let highestScore = 0;

        for (const topic of data.topics || []) {
            let score = 0;
            for (const keyword of topic.keywords || []) {
                const kw = keyword.toLowerCase().trim();
                if (kw && cleanedInput.includes(kw)) {
                    // Weight multi-word or longer keyword matches slightly higher
                    score += kw.split(/\s+/).length;
                }
            }

            if (score > highestScore) {
                highestScore = score;
                bestMatch = topic;
            }
        }

        if (bestMatch) {
            return res.json({
                reply: bestMatch.reply,
                matchedTopic: bestMatch.id,
                link: bestMatch.link || null,
                linkLabel: bestMatch.linkLabel || null,
            });
        }

        return res.json({
            reply: data.fallback,
            matchedTopic: 'fallback',
            link: null,
            linkLabel: null,
        });
    } catch (err) {
        console.error('Error processing chat message:', err);
        return res.status(500).json({ error: 'Failed to process chat message.' });
    }
});

// GET /api/topics — Return all current topics from responses.json
app.get('/api/topics', (req, res) => {
    try {
        const data = loadResponses();
        res.json(data.topics || []);
    } catch (err) {
        console.error('Error reading responses.json:', err);
        res.status(500).json({ error: 'Failed to read responses.json' });
    }
});

// POST /api/topics — Append a new fact/topic to responses.json
app.post('/api/topics', (req, res) => {
    const { id, keywords, reply, link, linkLabel } = req.body;

    if (!keywords || !reply) {
        return res.status(400).json({ error: 'Keywords and reply are required.' });
    }

    try {
        const data = loadResponses();

        const keywordArray = Array.isArray(keywords)
            ? keywords.map((k) => k.trim().toLowerCase()).filter(Boolean)
            : keywords
                .split(',')
                .map((k) => k.trim().toLowerCase())
                .filter(Boolean);

        const newTopic = {
            id: id?.trim() || `custom_${Date.now()}`,
            keywords: keywordArray,
            reply: reply.trim(),
            ...(link?.trim() && { link: link.trim() }),
            ...(linkLabel?.trim() && { linkLabel: linkLabel.trim() }),
        };

        data.topics.push(newTopic);
        fs.writeFileSync(responsesPath, JSON.stringify(data, null, 2), 'utf-8');

        res.status(201).json({ message: 'Lore inscribed.', topic: newTopic });
    } catch (err) {
        console.error('Error saving new topic:', err);
        res.status(500).json({ error: 'Failed to save new topic.' });
    }
});

app.listen(PORT, () => {
    console.log(`Harald Hardrada server running on http://localhost:${PORT}`);
});