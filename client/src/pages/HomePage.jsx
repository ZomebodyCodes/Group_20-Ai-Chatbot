import { NavLink } from 'react-router';

export default function HomePage() {
    return (
        <div className="pov-container">
            <img
                src="/campfire-bg.png"
                alt="Harald Hardrada sitting by a crackling campfire"
                className="bg-image"
            />
            <div className="shadow-overlay" />

            <div className="hud-content home-landing">
                <header className="clan-header">
                    <h1>Harald Hardrada</h1>
                    <p>ᛟ Last of the Great Viking Kings • AD 1066 ᛟ</p>
                </header>

                <div className="landing-center">
                    <p className="landing-intro">
                        From the blood-soaked field of Stiklestad to the golden halls of Byzantium,
                        and now to the shores of England—sit by the embers and hear the saga from the Hard Ruler himself.
                    </p>

                    <div className="landing-actions">
                        <NavLink to="/chat" className="landing-primary-btn">
                            ᛟ Approach the Fire
                        </NavLink>
                        <NavLink to="/add-facts" className="option-btn">
                            ᛉ Inscribe Lore
                        </NavLink>
                    </div>
                </div>

                <footer className="landing-footer">
                    <span>Group 20 • Historical Interactive Chronicle</span>
                </footer>
            </div>
        </div>
    );
}