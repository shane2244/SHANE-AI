import { useState } from "react";
import { Flame, Heart, LockKeyhole, PersonStanding, ScrollText, Waves, Wind } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";

const breathwork = [
  { name: "Sacral Womb Breath", note: "Rest both hands over your lower belly. Breathe deep and slow, imagining warm orange light pooling and swirling in the pelvis—the seat of creation." },
  { name: "Nadi Shodhana", accent: "Alternate-nostril", note: "Balance the twin currents of energy, softening raw desire into steady creative focus and flow." },
  { name: "Kapalabhati", accent: "Skull-shining", note: "A traditional rhythmic breathing practice often used to cultivate attention and inner warmth." },
];

const poses = [
  { name: "Baddha Konasana", translation: "Bound Angle", note: "Opens the hips and invites softness, receptivity, and an awareness of the lower body." },
  { name: "Bhujangasana", translation: "Cobra", note: "Awakens the spine and lower belly through a gentle, supported backbend." },
  { name: "Ustrasana", translation: "Camel", note: "A heart-and-hip opening posture approached gradually and without forcing range." },
  { name: "Malasana", translation: "Garland Squat", note: "Grounds through the feet while exploring mobility and space around the hips and pelvic floor." },
];

const tantraChapters = [
  { title:"Tantra is larger than sexuality", text:"Tantra names diverse Hindu and Buddhist traditions of scripture, initiation, mantra, deity practice, ritual, subtle-body visualization, and liberation. It does not refer to one universal method, and many Tantric paths contain no partnered sexual practice at all." },
  { title:"Kundalini is a liberation symbol", text:"In subtle-body traditions, Kundalini—‘the coiled one’—is Shakti: latent divine potential. Its ascent through a mapped inner body symbolizes transformation and, in some systems, union with Shiva or nondual awareness. It is not simply a synonym for libido." },
  { title:"Where sexual energy does connect", text:"Some Kaula and related lineages ritualized sexual union under highly specific conditions. The aim was not ordinary pleasure or performance, but transgression of limiting dualities, disciplined awareness, and a ritual recognition of body and cosmos as sacred." },
  { title:"Classical Tantra and neo-Tantra differ", text:"Modern neo-Tantra often emphasizes intimacy, embodiment, healing, and sexual fulfillment. Those practices may be meaningful on their own terms, but they should not be presented as an unchanged transmission of all classical Tantra." },
  { title:"Intensity is not proof of awakening", text:"Heat, trembling, emotion, altered perception, or sexual arousal can have many explanations. A dramatic sensation does not prove spiritual rank, supernatural power, or a completed Kundalini awakening." },
  { title:"Ethics are not optional", text:"No spiritual teacher, energy claim, or initiatory language overrides consent. Healthy practice protects autonomy, informed choice, boundaries, cultural context, and the right to stop without spiritual pressure or punishment." },
];

export default function SacralPage() {
  const { user } = useAuth();
  const [activePractice, setActivePractice] = useState("Sacral Womb Breath");
  return <div className="page sacral-page">
    <section className="sacral-fire" data-testid="sacral-hero-section"><p className="kicker"><Flame /> Svadhisthana · Sacral fire</p><h1 data-testid="sacral-heading">Your creative fire.</h1><p data-testid="sacral-description">The orange sacral center is held in yogic and chakra traditions as a symbol of life-force, creativity, passion, sensuality, and flow. Awaken it, breathe with it, and explore the stories carried through your lineage.</p></section>

    <section className="sacral-topic" data-testid="kundalini-section"><div className="topic-heading"><Flame /><h2>Kundalini & Tantra</h2></div><div className="topic-panel"><p>Sexual and creative energy are often described as expressions of the same sacred fire. This practice invites you to notice your sacral current and redirect attention toward creativity, presence, and intentional living.</p><Link to="/companion" data-testid="awaken-sacral-fire-link"><Flame /> Awaken my sacral fire</Link></div></section>

    <section className="sacral-topic" data-testid="sacred-sexuality-section"><div className="topic-heading"><Heart /><h2>Let’s talk about sacred sexuality</h2></div><div className="topic-panel"><p>Across spiritual, psychological, and holistic traditions, sexual energy is sometimes understood as a potent form of life-force. It can be explored as intimacy, creative agency, emotional connection, and personal transformation.</p><p>A grounded approach centers consent, boundaries, mutuality, bodily autonomy, and freedom from pressure. Spiritual language should deepen those values—never override them.</p></div></section>

    <section className="tantra-deep-dive" data-testid="tantra-kundalini-deep-dive"><div className="section-heading"><p className="kicker"><Flame /> Beyond the mainstream reduction</p><h2>Tantra, Kundalini & the sexual-energy question.</h2><p>The most honest answer holds history, living tradition, symbolism, body experience, and modern adaptation apart long enough to understand each one.</p></div><div className="tantra-chapters">{tantraChapters.map((chapter,index)=>{const locked=index>=3&&!user?.is_premium;return <article key={chapter.title} className={locked?"locked":""} data-testid={`tantra-chapter-${index+1}`}><span>0{index+1}</span><h3>{chapter.title}</h3>{locked?<><p className="blur-value">The full historical and practice context continues inside Premium.</p><LockKeyhole/></>:<p>{chapter.text}</p>}</article>})}</div>{!user?.is_premium&&<div className="tantra-unlock"><LockKeyhole/><p><strong>Half of the guide is open.</strong> Unlock the classical/modern distinction, grounded awakening guidance, and the complete ethics chapter.</p><Link to="/membership" data-testid="unlock-tantra-guide-link">Read the full guide</Link></div>}<div className="tantra-sources" data-testid="tantra-source-links"><span>Start with scholarship</span><a href="https://theconversation.com/is-tantra-about-sex-or-divine-liberation-why-followers-are-split-over-the-ancient-yogic-tradition-233876" target="_blank" rel="noreferrer">Tantra: sex or liberation?</a><a href="https://blog.oup.com/2022/10/modern-tantra-and-the-global-history-of-religion/" target="_blank" rel="noreferrer">Modern Tantra’s history</a><a href="https://press.uchicago.edu/ucp/books/book/chicago/K/bo3617827.html" target="_blank" rel="noreferrer">Kiss of the Yoginī</a></div></section>

    <section className="sacral-practices" data-testid="pranayama-yoga-section"><div className="section-heading"><p className="kicker"><Wind /> Pranayama & Yoga</p><h2>Breath and posture for sacral awareness.</h2><p>Approach these traditional practices gently. Stop if you feel dizzy, strained, or uncomfortable, and seek qualified instruction when needed.</p></div><div className="practice-grid">{breathwork.map((practice, index)=><button key={practice.name} className={activePractice===practice.name?"active":""} onClick={()=>setActivePractice(practice.name)} data-testid={`breathwork-${index+1}-button`}><Wind/><h3>{practice.name}</h3>{practice.accent&&<small>{practice.accent}</small>}<p>{practice.note}</p></button>)}</div><div className="pose-list">{poses.map((pose,index)=><article key={pose.name} className={index>1?"premium-pose":""} data-testid={`yoga-pose-${index+1}`}><PersonStanding/><div><h3>{pose.name} <em>· {pose.translation}</em></h3><p>{pose.note}</p></div>{index>1&&<LockKeyhole/>}</article>)}</div></section>

    <section className="akashic-section" data-testid="akashic-records-section"><div className="topic-heading"><ScrollText /><h2>Akashic Records · Soul Lineage</h2></div><div className="akashic-panel"><p>Who were you before this life? Use the Records as a symbolic reflection across the veil—exploring Orisha resonance, stories of Lemuria and Atlantis, Anunnaki threads, and StarSeed origin as spiritual imagination rather than verified history.</p><small>For spiritual reflection and inspiration—a mirror for your soul, not a history lesson.</small><Link to="/membership" data-testid="open-akashic-records-link"><ScrollText /> Open my Akashic Records</Link></div></section>

    <section className="sacral-paywall" data-testid="sacral-premium-section"><Waves/><div><p className="kicker">Half of this path is open</p><h2>Premium connects breath, body, lineage, Human Design authority, and your reflection history.</h2></div><Link to="/membership" data-testid="unlock-sacral-link">Unlock the full practice</Link></section>
  </div>;
}