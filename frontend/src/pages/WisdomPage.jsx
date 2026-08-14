import { ArrowDown, ArrowRight, BadgeCheck, BookOpen, CircleDot, Earth, Layers3, Orbit, Scale, Sparkles, Sprout } from "lucide-react";

const origins = [
  { year: "1870s", title: "Theosophical roots", text: "Western esotericism blended reincarnation, cosmic evolution, and the idea of humanity guided by unseen intelligences." },
  { year: "1970s", title: "A modern identity appears", text: "New Age writers, including Brad Steiger, helped popularize the idea of souls whose origins were associated with other worlds or dimensions." },
  { year: "Today", title: "A digital constellation", text: "Online communities use StarSeed language to explore belonging, sensitivity, purpose, and a felt responsibility toward collective change." },
];

const lineages = [
  ["Pleiadian", "Compassion & harmony", "Often associated with heart-led service, emotional sensitivity, and relational healing."],
  ["Sirian", "Devotion & stewardship", "Commonly connected with sacred knowledge, water symbolism, discipline, and guardianship."],
  ["Arcturian", "Insight & innovation", "Often framed through intelligence, energetic systems, pattern recognition, and future-oriented thinking."],
  ["Andromedan", "Freedom & expansion", "Linked with independence, movement beyond limitation, and questioning inherited structures."],
  ["Lyran", "Creation & courage", "Associated with origin stories, creative sovereignty, resilience, and leadership through change."],
  ["Orion", "Polarity & integration", "Often understood as learning through contrast, intellect, power dynamics, and the reconciliation of opposites."],
];

const topics = [
  { icon: Sparkles, title: "Higher Consciousness", text: "Awareness, awakening, nonduality, meditation, intuition, shadow, and the ethics of inner growth.", color: "#F1C75B" },
  { icon: Layers3, title: "Metaphysics", text: "Being, mind, time, causality, synchronicity, energy, and how spiritual traditions approach reality.", color: "#56CFE1" },
  { icon: Sprout, title: "Holistic Living", text: "Whole-person practices for reflection, embodiment, rest, ritual, creativity, relationship, and belonging.", color: "#75D19C" },
  { icon: BookOpen, title: "Spiritual Traditions", text: "Respectful introductions to contemplative lineages, mysticism, sacred texts, and living spiritual practice.", color: "#FF7A67" },
];

export default function WisdomPage() {
  return (
    <div className="page wisdom-page">
      <section className="wisdom-hero">
        <div><p className="kicker">The living wisdom atlas</p><h1 data-testid="wisdom-heading">A central field guide<br />to the <em>inner & infinite.</em></h1><p data-testid="wisdom-description">Explore spirituality with wonder and discernment. Every guide separates history, lived belief, symbolic meaning, and established evidence—so curiosity never requires surrendering critical thought.</p><a href="#starseeds" className="primary-action" data-testid="jump-to-starseeds-link">Begin with StarSeeds <ArrowDown size={18} /></a></div>
        <div className="authority-principles" data-testid="authority-principles"><p className="kicker">Our editorial compass</p><div><BadgeCheck /><span><strong>Context before claims</strong>We show where an idea comes from and how it changed.</span></div><div><Scale /><span><strong>Belief beside evidence</strong>Spiritual meaning and scientific fact are labeled clearly.</span></div><div><Earth /><span><strong>Respect without appropriation</strong>Traditions are presented with origin, nuance, and care.</span></div></div>
      </section>

      <section className="topic-atlas" data-testid="topic-atlas-section">
        <div className="atlas-heading"><p className="kicker">Four connected worlds</p><h2>Follow an idea<br />across disciplines.</h2></div>
        <div className="topic-grid">{topics.map(({ icon: Icon, title, text, color }) => <article key={title} style={{ "--topic-color": color }} data-testid={`topic-${title.toLowerCase().replaceAll(" ", "-")}`}><Icon /><h3>{title}</h3><p>{text}</p><span>Growing collection <ArrowRight size={15} /></span></article>)}</div>
      </section>

      <section id="starseeds" className="starseed-guide" data-testid="starseed-guide-section">
        <div className="starseed-guide-hero"><img src="https://images.unsplash.com/photo-1720293862150-db43f88382bf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwzfHxwZXJzb24lMjBzdGFyZ2F6aW5nJTIwbWlsa3klMjB3YXklMjBuaWdodHxlbnwwfHx8Ymx1ZXwxNzg2NzI4NzI4fDA&ixlib=rb-4.1.0&q=85" alt="A lone person contemplating the Milky Way" /><div><span>01 · Cosmic identity</span><h2>StarSeeds</h2><p>A modern spiritual framework for cosmic belonging, earthly purpose, and transformation.</p></div></div>
        <div className="guide-definition"><Orbit /><div><p className="kicker">The clearest definition</p><h2>What does “StarSeed” mean?</h2><p>Within contemporary New Age spirituality, a StarSeed is a person who believes—or uses the symbolic idea—that their soul originated beyond Earth before incarnating here. The belief often carries a sense of mission: supporting healing, awakening, creativity, or a more compassionate collective future.</p><p>There is no scientific evidence that human souls originate in star systems. For many people, however, the framework functions as spiritual identity, personal mythology, or a language for lifelong feelings of difference and purpose.</p></div></div>
        <div className="belief-lens" data-testid="starseed-belief-lens"><div><CircleDot /><p className="kicker">Belief lens</p><h3>Held literally</h3><p>Some practitioners understand cosmic origin, past lives, and soul mission as metaphysical realities.</p></div><div><CircleDot /><p className="kicker">Symbolic lens</p><h3>Held archetypally</h3><p>Others use StarSeed language as myth—a creative mirror for values, sensitivities, and the desire to serve.</p></div><div><CircleDot /><p className="kicker">Critical lens</p><h3>Held with discernment</h3><p>Psychology notes pattern-matching and the Forer effect; scholarship places the movement within modern Western esotericism.</p></div></div>
      </section>

      <section className="origins-section" data-testid="starseed-origins-section"><div className="section-heading"><p className="kicker">How the idea arrived</p><h2>From esoteric cosmology<br />to online identity.</h2></div><div className="origin-timeline">{origins.map((item) => <article key={item.year}><span>{item.year}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>

      <section className="lineage-section" data-testid="starseed-lineages-section"><div className="section-heading"><p className="kicker">Common modern archetypes</p><h2>The named “lineages”</h2><p>These descriptions vary widely between teachers and communities. They are not astronomical or biological classifications; approach them as evolving spiritual archetypes.</p></div><div className="lineage-grid">{lineages.map(([name, quality, text], index) => <article key={name} data-testid={`lineage-${name.toLowerCase()}`}><span>0{index + 1}</span><p className="kicker">{quality}</p><h3>{name}</h3><p>{text}</p></article>)}</div></section>

      <section className="discernment-section" data-testid="discernment-section"><div><p className="kicker">Stay cosmic. Stay grounded.</p><h2>Discernment is a spiritual practice, too.</h2><p>Expansive ideas should deepen your agency and care—not isolate you, make you fearful, or replace qualified support. Notice teachers who demand certainty, money, secrecy, or obedience.</p></div><ul><li><strong>Ask what is known.</strong><span>Separate personal revelation, tradition, metaphor, and testable evidence.</span></li><li><strong>Watch the impact.</strong><span>A useful practice supports relationships, responsibility, and everyday functioning.</span></li><li><strong>Keep your sovereignty.</strong><span>No reading or identity should decide your worth, health, finances, or future.</span></li><li><strong>Choose grounded care.</strong><span>Spiritual exploration can complement—but not replace—medical or mental-health support.</span></li></ul></section>
    </div>
  );
}