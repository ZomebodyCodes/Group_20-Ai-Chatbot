import { useState, useEffect } from 'react';
import { NavLink } from 'react-router';

export default function AddFactsPage() {
    const [topicId, setTopicId] = useState('');
    const [keywords, setKeywords] = useState('');
    const [reply, setReply] = useState('');
    const [status, setStatus] = useState('');
    const [topics, setTopics] = useState([]);

    const fetchTopics = async () => {
        try {
            const res = await fetch('/api/topics');
            const data = await res.json();
            setTopics(data);
        } catch (err) {
            console.error('Failed to load topics:', err);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!keywords.trim() || !reply.trim()) return;

        setStatus('Carving into the saga...');

        try {
            const res = await fetch('/api/topics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: topicId,
                    keywords,
                    reply,
                }),
            });

            if (!res.ok) throw new Error('Failed to save');

            setTopicId('');
            setKeywords('');
            setReply('');
            setStatus('ᛟ Fact added! Return to the fire to ask Harald.');
            fetchTopics();
        } catch (err) {
            console.error(err);
            setStatus('Could not reach the server on port 5000.');
        }
    };

    return (
        <div className="pov-container">
            <img
                src="/campfire-bg.png"
                alt="Campfire backdrop"
                className="bg-image"
            />
            <div className="shadow-overlay" />

            <div className="hud-content lore-page">
                <header className="clan-header">
                    <div className="top-nav-bar">
                        <NavLink to="/" className="nav-rune-btn">
                            ᛟ Home
                        </NavLink>
                        <NavLink to="/chat" className="nav-rune-btn">
                            ᛉ Speak to Harald
                        </NavLink>
                    </div>

                    <h1>Inscribe Saga Lore</h1>
                    <p>ᛉ Add New Facts to Harald&apos;s Memory ᛉ</p>
                </header>

                <div className="lore-stage">
                    <form onSubmit={handleSubmit} className="lore-form">
                        <label>
                            Topic ID (optional)
                            <input
                                type="text"
                                placeholder="e.g. battle_of_nisaa"
                                value={topicId}
                                onChange={(e) => setTopicId(e.target.value)}
                            />
                        </label>

                        <label>
                            Trigger Keywords (comma-separated)
                            <input
                                type="text"
                                required
                                placeholder="e.g. nisaa, fleet, naval, sea battle"
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                            />
                        </label>

                        <label>
                            Harald&apos;s Response (First-Person AD 1066)
                            <textarea
                                rows="4"
                                required
                                placeholder="Write how Harald speaks about this fact..."
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                            />
                        </label>

                        <button type="submit" className="option-btn submit-lore-btn">
                            Carve Into Chronicle ᛉ
                        </button>

                        {status && <p className="lore-status">{status}</p>}
                    </form>

                    <div className="existing-topics">
                        <h3>Inscribed Topics ({topics.length})</h3>
                        <ul>
                            {topics.map((t, i) => (
                                <li key={i}>
                                    <strong>{t.id}</strong> — <span>{t.keywords.join(', ')}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}