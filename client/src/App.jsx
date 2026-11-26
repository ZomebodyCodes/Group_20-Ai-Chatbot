import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const initialGreeting =
    "Sit, traveler. The night is cold, but the fire is eager and the story is long. State your name, and ask what you will of my years in Byzantium, the wars I have fought, or the kingdoms I have ruled.";

  const [fullText, setFullText] = useState(initialGreeting);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [bgImage, setBgImage] = useState('/campfire-bg.png');
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);

  const quickPrompts = [
    "ᛟ Tell me of your conquests",
    "✝ What is your faith?",
    "ᛏ Speak of Viking life"
  ];

  // Set default volume and start loop on first user interaction (bypasses browser autoplay block)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.35; // Keep ambient music subtle behind the text

    const startAudioOnInteract = () => {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          window.removeEventListener('pointerdown', startAudioOnInteract);
        })
        .catch(() => {
          // Browser still waiting for a direct click
        });
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

  // Typewriter effect triggered whenever fullText changes
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;

    const timer = setInterval(() => {
      index += 1;
      setDisplayedText(fullText.slice(0, index));

      if (index >= fullText.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 32);

    return () => clearInterval(timer);
  }, [fullText]);

  const handleSkipTypewriter = () => {
    if (isTyping) {
      setDisplayedText(fullText);
      setIsTyping(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setInputValue('');

    const topicBackgrounds = {
      greeting: '/campfire-warm.png',
      viking_culture_daily_life: '/campfire-warm.png',
      varangian_conquests: '/campfire-fierce.png',
      norway_denmark_conquests: '/campfire-fierce.png',
      england_stamford_bridge: '/campfire-fierce.png',
      stiklestad_exile: '/campfire-fierce.png',
      christianity: '/campfire-bg.png',
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
      setFullText(data.reply || "The fire crackles, yet no words come.");
    } catch (error) {
      console.error('Error talking to server:', error);
      setBgImage('/campfire-bg.png');
      setFullText("The spirits are silent... (Make sure the Express server is running on port 5000)");
    }
  };

  return (
    <div className="pov-container">
      {/* Looping Ambient Audio */}
      <audio ref={audioRef} src="/campfire-ambience.mp3" loop preload="auto" />

      <img
        src={bgImage}
        alt="Sitting across from Harald Hardrada at a crackling campfire"
        className="bg-image"
      />

      <div className="shadow-overlay" />

      <div className="hud-content">
        <header className="clan-header">
          <button
            type="button"
            className="audio-toggle-btn"
            onClick={toggleAudio}
            title={isPlaying ? "Silence the fire" : "Hear the fire"}
          >
            {isPlaying ? "ᛟ Sound: On" : "ᛟ Sound: Off"}
          </button>
          <h1>Harald Hardrada</h1>
          <p>ᛟ King of Norway • AD 1066 ᛟ</p>
        </header>

        <div className="dialogue-stage">
          <div className="dialogue-stream" onClick={handleSkipTypewriter}>
            <div className="npc-name">Harald</div>
            <p className="dialogue-text">
              "{displayedText}"
              {isTyping && <span className="rune-cursor">ᛉ</span>}
            </p>
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
    </div>
  );
}

export default App;