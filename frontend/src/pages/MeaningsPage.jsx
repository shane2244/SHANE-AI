import { useState } from "react";
import { ArrowRight, Bird, CloudMoon, Eye, Hash, Leaf, Search, Sparkles } from "lucide-react";

const entries = [
  { title: "1111", category: "Numbers", icon: Hash, short: "Attention, alignment, and the meaning you give a threshold moment.", tradition: "Modern numerology", meaning: "Often interpreted as an invitation to notice your thoughts, intentions, or sense of direction." },
  { title: "222", category: "Numbers", icon: Hash, short: "Balance, relationship, patience, and trust in unfolding.", tradition: "Modern numerology", meaning: "Commonly used as a prompt to examine cooperation, timing, and the foundations beneath a choice." },
  { title: "444", category: "Numbers", icon: Hash, short: "Stability, support, boundaries, and grounded action.", tradition: "Modern numerology", meaning: "Often associated with reassurance, structure, and returning spiritual insight to practical life." },
  { title: "Cardinal", category: "Animals", icon: Bird, short: "Vitality, remembrance, visibility, and the warmth of connection.", tradition: "Folklore & personal symbolism", meaning: "Its vivid color can symbolize life force or remembrance; meanings vary by culture and lived experience." },
  { title: "Butterfly", category: "Animals", icon: Bird, short: "Transformation, fragility, emergence, and cycles of becoming.", tradition: "Cross-cultural symbol", meaning: "Frequently read as a mirror for change, impermanence, and identity taking a new form." },
  { title: "Owl", category: "Animals", icon: Bird, short: "Night vision, hidden knowledge, vigilance, and mystery.", tradition: "Multiple cultural traditions", meaning: "Interpretations range from wisdom to warning. Cultural context matters more than a universal definition." },
  { title: "Feathers", category: "Nature", icon: Leaf, short: "Lightness, messages, transition, and attention to the ordinary.", tradition: "Folk spirituality", meaning: "Some view found feathers as signs; others use them as mindful reminders of place, species, and moment." },
  { title: "Full Moon", category: "Nature", icon: CloudMoon, short: "Illumination, culmination, release, and emotional reflection.", tradition: "Lunar spirituality", meaning: "The full moon often marks a reflective peak in ritual calendars, though it does not determine personal events." },
  { title: "Ringing Ears", category: "Experiences", icon: Sparkles, short: "Heightened attention in spiritual lore—and a sensation with medical causes.", tradition: "Contemporary spirituality", meaning: "Some interpret it as energetic sensitivity. Persistent or sudden ringing deserves qualified medical attention." },
  { title: "Déjà Vu", category: "Experiences", icon: Eye, short: "Recognition, memory, synchronicity, and the strangeness of time.", tradition: "Mystical & psychological lenses", meaning: "Spiritual frameworks may call it alignment; neuroscience studies it as a memory-recognition phenomenon." },
  { title: "Flying Dreams", category: "Dreams", icon: CloudMoon, short: "Freedom, perspective, confidence, escape, or expanded possibility.", tradition: "Dream symbolism", meaning: "The emotional tone matters: effortless flight differs from fleeing, falling, or struggling to stay aloft." },
  { title: "Water Dreams", category: "Dreams", icon: CloudMoon, short: "Emotion, unconscious material, cleansing, uncertainty, and depth.", tradition: "Dream symbolism", meaning: "Clarity, movement, scale, and your relationship to the water offer richer clues than a fixed definition." },
];

const categories = ["All", "Numbers", "Animals", "Nature", "Dreams", "Experiences"];

export default function MeaningsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const filtered = entries.filter((entry) => (category === "All" || entry.category === category) && `${entry.title} ${entry.short}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="page meanings-page">
      <section className="meanings-hero">
        <div><p className="kicker">The symbolic dictionary</p><h1 data-testid="meanings-heading">Spiritual meaning<br />of <em>almost anything.</em></h1><p data-testid="meanings-description">Explore the stories people attach to signs, symbols, dreams, creatures, numbers, and unusual moments—with tradition, context, and grounded alternatives beside every interpretation.</p></div>
        <div className="meaning-search" data-testid="meaning-search-panel"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a symbol, number, dream…" data-testid="meaning-search-input" /><span>{filtered.length} meanings</span></div>
      </section>

      <nav className="meaning-filters" aria-label="Meaning categories" data-testid="meaning-category-filters">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)} data-testid={`meaning-filter-${item.toLowerCase()}-button`}>{item}</button>)}</nav>

      <section className="meaning-browser">
        <div className="meaning-grid" data-testid="meaning-results">{filtered.map((entry) => { const Icon = entry.icon; return <button key={entry.title} className={selected?.title === entry.title ? "active" : ""} onClick={() => setSelected(entry)} data-testid={`meaning-${entry.title.toLowerCase().replaceAll(" ", "-")}-button`}><span className="meaning-icon"><Icon /></span><small>{entry.category}</small><h2>{entry.title}</h2><p>{entry.short}</p><span className="meaning-open">Explore meaning <ArrowRight size={15} /></span></button>; })}{!filtered.length && <p className="no-meanings" data-testid="no-meaning-results">No guide matches that phrase yet. Try a broader symbol or category.</p>}</div>
        <aside className={`meaning-reader ${selected ? "open" : ""}`} data-testid="meaning-reader-panel">
          {selected ? <><p className="kicker">Spiritual meaning of</p><h2 data-testid="selected-meaning-title">{selected.title}</h2><span className="tradition-label" data-testid="selected-meaning-tradition">Lens · {selected.tradition}</span><p data-testid="selected-meaning-summary">{selected.meaning}</p><div className="reflective-question"><Eye /><span><strong>Make it personal</strong>What was happening around you, and what meaning feels useful without forcing certainty?</span></div><p className="meaning-note">Symbolic meanings are interpretive, not predictive. They should not replace medical, mental-health, legal, or financial guidance.</p></> : <div className="reader-empty"><Eye /><h2>Select a symbol</h2><p>Open any guide to compare its spiritual interpretation, cultural lens, and grounded context.</p></div>}
        </aside>
      </section>
    </div>
  );
}