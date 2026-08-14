import { useState } from "react";
import axios from "axios";
import { RefreshCw, Sparkle } from "lucide-react";
import { motion } from "framer-motion";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function TarotPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const draw = async () => { setLoading(true); const { data } = await axios.get(`${API}/tarot/draw`); setCards(data); setLoading(false); };
  return (
    <div className="page tarot-page">
      <section className="tarot-intro"><p className="kicker">Tarot as play therapy</p><h1 data-testid="tarot-heading">Not a prediction.<br /><em>A projection.</em></h1><p data-testid="tarot-description">Choose three archetypes as mirrors for what your imagination, attention, and intuition may already be holding.</p><button onClick={draw} className="primary-action" data-testid="draw-cards-button">{cards.length ? <RefreshCw size={18} /> : <Sparkle size={18} />}{loading ? "Shuffling…" : cards.length ? "Draw again" : "Draw three mirrors"}</button></section>
      <section className="tarot-table" data-testid="tarot-card-area">
        {[0,1,2].map((index) => {
          const card = cards[index];
          return <motion.article key={index} className={`tarot-card ${card ? "revealed" : ""}`} initial={false} animate={{ rotateY: card ? 0 : 180 }} transition={{ delay: index * .12 }} data-testid={`tarot-card-${index + 1}`}>
            {card ? <><span className="card-index">0{index + 1}</span><div className="card-sigil"><Sparkle /></div><p className="kicker">{card.archetype}</p><h2>{card.name}</h2><p>{card.reflection}</p><blockquote>{card.question}</blockquote></> : <><div className="card-back-mark">S</div><span>Choose the unknown</span></>}
          </motion.article>;
        })}
      </section>
      <p className="tarot-disclaimer" data-testid="tarot-disclaimer">Use the cards for creative self-inquiry—not fortune telling, diagnosis, or decisions on your behalf.</p>
    </div>
  );
}