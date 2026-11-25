import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const initialGreeting =
    "Sit, traveler. The night is cold, but the fire is eager and the story is long. State your name, and ask what you will of my years in Byzantium, the wars I have fought, or the kingdoms I have ruled.";

  const [fullText, setFullText] = useState(initialGreeting);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [inputValue, setInputValue] = useState('');

  const quickPrompts = [
    "ᛟ Tell me of the Varangian Guard",
    "ᛉ Why call you 'The Hard Ruler'?",
    "ᛏ What of the English throne?"
  ];

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
    }, 32); // Typing speed in milliseconds

    return () => clearInterval(timer);
  }, [fullText]);

  // Allow clicking the text to instantly finish typing
  const handleSkipTypewriter = () => {
    if (isTyping) {
      setDisplayedText(fullText);
      setIsTyping(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Temporary placeholder response until connected to your JSON backend
    setFullText(`You ask of "${inputValue}"... Stir the embers, and let me recall those bloody days.`);
    setInputValue('');
  };

  return (
    <div className="pov-container">
      <img
        src="/campfire-bg.png"
        alt="Sitting across from Harald Hardrada at a crackling campfire"
        className="bg-image"
      />

      <div className="shadow-overlay" />

      <div className="hud-content">
        <header className="clan-header">
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