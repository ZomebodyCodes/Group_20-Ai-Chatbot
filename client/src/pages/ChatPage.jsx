import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router';

export default function ChatPage() {
    const initialGreeting =
        "Sit, traveler. The night is cold, but the fire is eager and the story is long. State your name, and ask what you will of my years in Byzantium, the wars I have fought, or the kingdoms I have ruled.";

    const [messages, setMessages] = useState([
        { sender: 'harald', text: initialGreeting }
    ]);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [bgImage, setBgImage] = useState('/campfire-bg.png');
    const [isPlaying, setIsPlaying] = useState(false);

    const audioRef = useRef(null);
    const streamEndRef = useRef(null);

    const quickPrompts = [
        "ᛟ Tell me of your conquests",
        "✝ What is your faith?",
        "ᛏ Speak of Viking life"
    ];

    const latestMessage = messages[messages.length - 1];

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = 0.35;

        const startAudioOnInteract = () => {
            audio.play()
                .then(() => {
                    setIsPlaying(true);
                    window.removeEventListener('pointerdown', startAudioOnInteract);
                })
                .catch(() => { });
        };

        window.addEventListener('pointerdown', startAudioOnInteract);
        return () => window.removeEventListener('pointerdown', startAudioOnInteract);
    }, []);

    const toggleAudio = (e) => {
        e.stopPropagation();
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play();
            setIsPlaying(true);
        }
    };

    useEffect(() => {
        if (!latestMessage) return;

        if (latestMessage.sender === 'user') {
            setDisplayedText(latestMessage.text);
            setIsTyping(false);
            return;
        }

        const targetText = latestMessage.text;
        setDisplayedText('');
        setIsTyping(true);
        let index = 0;

        const timer = setInterval(() => {
            index += 1;
            setDisplayedText(targetText.slice(0, index));

            if (index >= targetText.length) {
                clearInterval(timer);
                setIsTyping(false);
            }
        }, 32);

        return () => clearInterval(timer);
    }, [messages]);

    useEffect(() => {
        streamEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, displayedText]);

    const handleSkipTypewriter = () => {
        if (isTyping && latestMessage?.sender === 'harald') {
            setDisplayedText(latestMessage.text);
            setIsTyping(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage = inputValue.trim();
        setInputValue('');
        setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);

        const topicBackgrounds = {
            greeting: '/campfire-warm.png',
            family_elisiv: '/campfire-warm.png',
            viking_culture_daily_life: '/campfire-warm.png',
            longships_navigation: '/campfire-warm.png',
            varangian_conquests: '/campfire-fierce.png',
            byzantine_escape: '/campfire-fierce.png',
            norway_denmark_conquests: '/campfire-fierce.png',
            weapons_warfare: '/campfire-fierce.png',
            england_stamford_bridge: '/campfire-fierce.png',
            stiklestad_exile: '/campfire-fierce.png',
            christianity: '/campfire-bg.png',
            norse_gods_mythology: '/campfire-bg.png',
            fallback: '/campfire-bg.png',
        };

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await response.json();
            setBgImage(topicBackgrounds[data.matchedTopic] || '/campfire-bg.png');
            setMessages((prev) => [
                ...prev,
                {
                    sender: 'harald',
                    text: data.reply || "The fire crackles, yet no words come.",
                    link: data.link || null,
                    linkLabel: data.linkLabel || null,
                }
            ]);
        } catch (error) {
            console.error('Error talking to server:', error);
            setBgImage('/campfire-bg.png');
            setMessages((prev) => [
                ...prev,
                { sender: 'harald', text: "The spirits are silent... (Make sure the Express server is running on port 5000)" }
            ]);
        }
    };

    return (
        <div className="pov-container">
            <audio ref={audioRef} src="/campfire-ambience.mp3" loop preload="auto" />

            <img
                src={bgImage}
                alt="Sitting across from Harald Hardrada at a crackling campfire"
                className="bg-image"
            />

            <div className="shadow-overlay" />

            <div className="hud-content">
                <header className="clan-header">
                    <div className="top-nav-bar">
                        <NavLink to="/" className="nav-rune-btn">
                            ᛟ Home
                        </NavLink>
                        <div className="top-nav-right">
                            <NavLink to="/add-facts" className="nav-rune-btn">
                                ᛉ Inscribe Lore
                            </NavLink>
                            <button
                                type="button"
                                className="audio-toggle-btn"
                                onClick={toggleAudio}
                                title={isPlaying ? "Silence the fire" : "Hear the fire"}
                            >
                                {isPlaying ? "ᛟ Sound: On" : "ᛟ Sound: Off"}
                            </button>
                        </div>
                    </div>

                </header>

                <div className="dialogue-history" onClick={handleSkipTypewriter}>
                    {messages.map((msg, idx) => {
                        const isLast = idx === messages.length - 1;
                        const textToRender = isLast ? displayedText : msg.text;

                        return (
                            <div
                                key={idx}
                                className={`dialogue-entry ${msg.sender === 'user' ? 'user-entry' : 'harald-entry'} ${!isLast ? 'past-entry' : ''}`}
                            >
                                <div className="npc-name">
                                    {msg.sender === 'user' ? 'ᛉ Traveler' : 'Harald'}
                                </div>
                                <p className="dialogue-text">
                                    "{textToRender}"
                                    {isLast && isTyping && msg.sender === 'harald' && (
                                        <span className="rune-cursor">ᛉ</span>
                                    )}
                                </p>

                                {msg.link && (!isLast || !isTyping) && (
                                    <a
                                        href={msg.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="chronicle-source-link"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        ᛟ {msg.linkLabel || "Consult Historical Chronicle"} ↗
                                    </a>
                                )}
                            </div>
                        );
                    })}
                    <div ref={streamEndRef} />
                </div>

                <div className="interaction-area">
                    <form onSubmit={handleSend} className="chat-input-line">
                        <input
                            type="text"
                            placeholder="Speak into the firelight..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button type="submit" className="send-btn">
                            Speak ᛉ
                        </button>
                    </form>

                    <div className="options-row">
                        {quickPrompts.map((prompt, idx) => (
                            <button
                                key={idx}
                                type="button"
                                className="option-btn"
                                onClick={() => setInputValue(prompt.replace(/^[^\w]+/, ''))}
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        </div >
    );
}