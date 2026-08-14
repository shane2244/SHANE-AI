import { useState } from "react";
import { Binary, CalendarDays, CircleDot, Fingerprint, LockKeyhole, Orbit, Sparkles, TreePine } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/components/AuthContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const systems = [
  { id: "astrology", label: "Astrology", subtitle: "your celestial pattern", icon: Orbit, color: "#39A7FF" },
  { id: "numerology", label: "Numerology", subtitle: "the vibration of name & birth", icon: Binary, color: "#FFE24A" },
  { id: "human_design", label: "Human Design", subtitle: "your energetic blueprint", icon: Fingerprint, color: "#2FFFE0" },
  { id: "chinese_astrology", label: "Chinese Astrology", subtitle: "your cyclical nature", icon: CircleDot, color: "#FF7900" },
  { id: "kabbalah", label: "Kabbalah", subtitle: "your Tree of Life", icon: TreePine, color: "#C86BFF" },
];

const labels = {
  astrology: [["Sun sign","sun_sign"],["Element","element"],["Modality","modality"],["Polarity","polarity"],["Ruler","ruler"],["Houses & aspects",null]],
  numerology: [["Life Path","life_path"],["Expression / Destiny","expression"],["Soul Urge","soul_urge"],["Personality","personality"],["Birthday","birthday"],["Personal Year","personal_year"]],
  chinese_astrology: [["Zodiac animal","animal"],["Element","element"],["Polarity","polarity"],["Heavenly stem",null],["Earthly branch",null],["Compatibility map",null]],
  human_design: [["Type",null],["Profile",null],["Authority",null],["Strategy",null],["Defined Centers",null],["Incarnation Cross",null]],
  kabbalah: [["Soul-lesson sphere",null],["Sefirah",null],["Pillar",null],["Path",null],["Four Worlds",null],["Integration practice",null]],
};

export default function BlueprintPage() {
  const { user } = useAuth(); const [active, setActive] = useState("astrology");
  const [form, setForm] = useState({ birth_name: "", birth_date: "", birth_time: "", birthplace: "" });
  const [report, setReport] = useState(null); const [error, setError] = useState(""); const current = systems.find((item) => item.id === active); const Icon = current.icon;
  const generate = async (event) => { event.preventDefault(); try { setError(""); const { data } = await axios.post(`${API}/profile/preview`, { ...form, birth_time: form.birth_time || null }); setReport(data); } catch { setError("Add a name and valid birth date to open your preview."); } };
  const values = report?.[active] || {};
  return <div className="page blueprint-page">
    <section className="blueprint-intro"><div><p className="kicker">Interactive guides · Step 01</p><h1 data-testid="blueprint-heading">Learn to read<br /><em>yourself.</em></h1><p data-testid="blueprint-description">Five living systems, one you. Explore each guide, then see how it maps onto your own chart.</p></div><form onSubmit={generate} className="birth-profile-form" data-testid="birth-profile-form"><div><CalendarDays /><span><strong>Open your free preview</strong>Half of every report is yours to explore.</span></div><input required value={form.birth_name} onChange={(e)=>setForm({...form,birth_name:e.target.value})} placeholder="Full birth name" data-testid="birth-name-input"/><input required type="date" value={form.birth_date} onChange={(e)=>setForm({...form,birth_date:e.target.value})} data-testid="birth-date-input"/><div className="birth-row"><input type="time" value={form.birth_time} onChange={(e)=>setForm({...form,birth_time:e.target.value})} data-testid="birth-time-input"/><input value={form.birthplace} onChange={(e)=>setForm({...form,birthplace:e.target.value})} placeholder="Birth city" data-testid="birthplace-input"/></div>{error&&<p className="action-error" data-testid="profile-preview-error">{error}</p>}<button type="submit" data-testid="generate-profile-preview-button">Generate my preview <Sparkles size={17}/></button></form></section>
    <nav className="report-tabs" data-testid="report-system-tabs">{systems.map((system)=>{const TabIcon=system.icon;return <button key={system.id} onClick={()=>setActive(system.id)} className={active===system.id?"active":""} style={{"--report-color":system.color}} data-testid={`${system.id.replaceAll("_","-")}-report-tab`}><TabIcon/><span>{system.label}</span></button>})}</nav>
    <section className="personal-report" style={{"--report-color":current.color}} data-testid={`${active.replaceAll("_","-")}-personal-report`}>
      <header><Icon/><div><p>Your {current.label}</p><span>{current.subtitle}</span></div></header>
      {!report ? <div className="report-empty"><Fingerprint/><h2>Your pattern begins with your details.</h2><p>Complete the profile above to reveal the first half of all five readings.</p></div> : <div className="report-fields">{labels[active].map(([label,key],index)=>{const locked=index>=3&&!user?.is_premium;const value=key?values[key]:null;return <article key={label} className={locked?"locked":""} data-testid={`${active.replaceAll("_","-")}-field-${index+1}`}><small>{label}</small>{locked?<><span className="blur-value">Deeper personal insight</span><LockKeyhole/></>:<strong>{value||values.preview||"Included in the verified full calculation"}</strong>}</article>})}</div>}
      {report&&!user?.is_premium&&<div className="half-paywall" data-testid="half-report-paywall"><LockKeyhole/><div><p>Half revealed · the deeper pattern continues</p><h2>Unlock every field, all three steps, and direct access to Shane.</h2></div><Link to="/membership" data-testid="unlock-full-report-link">Go Premium</Link></div>}
    </section>
    {report&&<p className="report-disclaimer" data-testid="report-disclaimer">{report.disclaimer} Human Design and full Kabbalah personalization remain clearly labeled until their verified calculation engines are connected.</p>}
  </div>;
}