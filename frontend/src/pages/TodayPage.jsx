import { useEffect, useState } from "react";
import { ArrowRight, CircleCheck, Flame, Orbit, Waves } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const moods = ["Open", "Tender", "Restless", "Grounded", "Bright"];
const weeklyRhythm = [
  { day: "mon", height: 2 }, { day: "tue", height: 4 }, { day: "wed", height: 3 },
  { day: "thu", height: 5 }, { day: "fri", height: 4 }, { day: "sat", height: 1 }, { day: "sun", height: 1 },
];

const MoodCheckIn = ({ selected, saved, error, onSelect, onSave }) => (
  <section className="checkin-band" data-testid="mood-checkin-section">
    <div><p className="kicker">60-second check-in</p><h2>How are you arriving?</h2></div>
    <div className="mood-list">
      {moods.map((mood) => <button key={mood} className={selected === mood ? "selected" : ""} onClick={() => onSelect(mood)} data-testid={`mood-${mood.toLowerCase()}-button`}>{mood}</button>)}
    </div>
    <button className="save-checkin" onClick={onSave} data-testid="save-mood-button">{saved ? <><CircleCheck size={18} /> Saved</> : "Save check-in"}</button>
    {error && <p className="action-error" data-testid="mood-save-error">{error}</p>}
  </section>
);

const RhythmPanel = ({ dashboard }) => (
  <article className="rhythm-panel" data-testid="weekly-rhythm-panel">
    <div className="rhythm-title"><div><p className="kicker">Your rhythm</p><h3>This week</h3></div><Flame /></div>
    <div className="rhythm-bars">{weeklyRhythm.map(({ day, height }) => <span key={day} data-testid={`rhythm-${day}-bar`} style={{ height: `${height * 12}px` }} />)}</div>
    <p><strong>{dashboard.mood_count}</strong> check-ins · <strong>{dashboard.journal_count}</strong> journal notes</p>
  </article>
);

export default function TodayPage() {
  const [selected, setSelected] = useState("Open");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [dashboard, setDashboard] = useState({ mood_count: 0, journal_count: 0 });

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard`, { signal: controller.signal })
      .then((result) => result.json())
      .then((payload) => setDashboard(payload))
      .catch((requestError) => { if (requestError.name !== "AbortError") setError("Your rhythm is temporarily unavailable."); });
    return () => controller.abort();
  }, []);
  const saveMood = async () => {
    try {
      setError("");
      await axios.post(`${API}/moods`, { mood: selected, energy: 3, note: "" });
      setSaved(true);
      setDashboard((value) => ({ ...value, mood_count: value.mood_count + 1 }));
    } catch {
      setError("Your check-in could not be saved. Please try again in a moment.");
    }
  };

  return (
    <motion.div className="page today-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <section className="today-hero">
        <div className="hero-copy">
          <p className="kicker" data-testid="today-date">A quiet place to begin</p>
          <h1 data-testid="today-heading">Come back to<br /><em>your own signal.</em></h1>
          <p data-testid="today-description">A lifelong reflective companion for knowing yourself, understanding connection, and living what matters.</p>
          <Link to="/companion" className="primary-action" data-testid="begin-reflection-link">Begin a reflection <ArrowRight size={19} /></Link>
        </div>
        <div className="signal-orbit" aria-hidden="true"><span>truth</span><span>empathy</span><span>purpose</span><div className="orbit-core">S</div></div>
      </section>

      <MoodCheckIn selected={selected} saved={saved} error={error} onSelect={(mood) => { setSelected(mood); setSaved(false); setError(""); }} onSave={saveMood} />

      <section className="today-grid">
        <article className="focus-panel" data-testid="current-focus-panel">
          <div className="panel-icon"><Waves /></div><p className="kicker">Today’s invitation</p>
          <h2>Notice what becomes possible when you stop performing certainty.</h2>
          <Link to="/journal" data-testid="write-in-journal-link">Write what comes up <ArrowRight size={17} /></Link>
        </article>
        <RhythmPanel dashboard={dashboard} />
      </section>
      <section className="starseed-feature" data-testid="starseed-feature-section">
        <div className="starseed-image"><img src="https://images.unsplash.com/photo-1720293862150-db43f88382bf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwzfHxwZXJzb24lMjBzdGFyZ2F6aW5nJTIwbWlsa3klMjB3YXklMjBuaWdodHxlbnwwfHx8Ymx1ZXwxNzg2NzI4NzI4fDA&ixlib=rb-4.1.0&q=85" alt="A person looking into a wide field of stars" /></div>
        <div className="starseed-copy"><Orbit /><p className="kicker">Flagship field guide</p><h2>StarSeeds:<br /><em>identity, myth & meaning</em></h2><p>Explore the modern spiritual belief that some souls identify with origins beyond Earth—its New Age roots, major archetypes, lived meaning, and the discernment needed to hold cosmic ideas without losing your ground.</p><Link to="/wisdom#starseeds" data-testid="explore-starseeds-link">Enter the StarSeeds guide <ArrowRight size={18} /></Link></div>
      </section>
    </motion.div>
  );
}