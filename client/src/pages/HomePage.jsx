import { NavLink } from 'react-router';

export default function HomePage() {
    const quickFacts = [
        {
            era: "c. 1015 – 1030 • Exile from Stiklestad",
            title: "The Wounded Prince",
            detail:
                "Born Harald Sigurdsson, he fought beside his half-brother King Olaf at the Battle of Stiklestad at age fifteen. After Olaf fell, a wounded Harald fled east into exile in Kievan Rus'."
        },
        {
            era: "c. 1034 – 1042 • Miklagard",
            title: "Commander of the Varangians",
            detail:
                "In Constantinople, Harald rose to lead the Byzantine Emperor's elite Varangian Guard—campaigning across Sicily, Bulgaria, and the Mediterranean while amassing a legendary fortune in eastern gold."
        },
        {
            era: "1046 – 1066 • King of Norway",
            title: "Hardrada, the Hard Ruler",
            detail:
                "Returning north with his Byzantine wealth, Harald claimed the Norwegian throne, established royal silver coinage, and waged nearly two decades of relentless naval warfare against Denmark."
        },
        {
            era: "September 1066 • Yorkshire",
            title: "The Final Invasion",
            detail:
                "Sailing to England with roughly 300 longships to claim the English crown, Harald won at Fulford before falling at the Battle of Stamford Bridge—an event widely seen as the end of the Viking Age."
        }
    ];

    const appFeatures = [
        {
            rune: "ᛟ",
            title: "Converse by the Fire",
            desc: "Ask Harald about his campaigns, faith, ships, or daily Norse life. Your questions are matched by the backend chronicle to shape his spoken replies and mood."
        },
        {
            rune: "ᛉ",
            title: "Inscribe New Lore",
            desc: "Expand the historical archive by adding new trigger keywords and first-person responses directly into the server's knowledge base."
        }
    ];

    return (

        <div className="pov-container home-clean-bg">
            <div className="hud-content home-scroll-page">
                <header className="clan-header">
                    <h1>Harald Hardrada</h1>
                    <p>ᛟ Last of the Great Viking Kings • AD 1066 ᛟ</p>
                </header>

                <main className="home-main">
                    {/* Hero Panel with Framed Painting */}
                    <section className="hero-panel">
                        <div className="hero-artwork-frame">
                            <img
                                src="/harald-hero.webp"
                                alt="Illustration of King Harald Hardrada"
                                className="hero-artwork"
                            />
                        </div>

                        <p className="landing-intro">
                            Step into an interactive historical dialogue set on the eve of Stamford Bridge in September 1066.
                            Question the exiled prince turned Varangian commander and King of Norway—or scribe new chapters into his saga.
                        </p>

                        <div className="landing-actions">
                            <NavLink to="/chat" className="landing-primary-btn">
                                ᛟ Approach the Fire
                            </NavLink>
                            <NavLink to="/add-facts" className="option-btn">
                                ᛉ Inscribe Lore
                            </NavLink>
                        </div>
                    </section>


                    {/* What This Application Does */}
                    <section className="chronicle-section">
                        <h2 className="section-rune-title">ᛟ How the Chronicle Works ᛟ</h2>
                        <div className="features-grid">
                            {appFeatures.map((item, idx) => (
                                <div key={idx} className="saga-card feature-card">
                                    <span className="card-rune">{item.rune}</span>
                                    <h3>{item.title}</h3>
                                    <p>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Historical Context: Quick Facts */}
                    <section className="chronicle-section">
                        <h2 className="section-rune-title">ᛉ Historical Context: The Thunderbolt of the North ᛉ</h2>
                        <div className="facts-grid">
                            {quickFacts.map((fact, idx) => (
                                <article key={idx} className="saga-card fact-card">
                                    <span className="fact-era">{fact.era}</span>
                                    <h3>{fact.title}</h3>
                                    <p>{fact.detail}</p>
                                </article>
                            ))}
                        </div>
                    </section>
                </main>

                <footer className="landing-footer">
                    <span>Group 20 • Interactive Historical Chronicle</span>
                </footer>
            </div>
        </div>
    );
}