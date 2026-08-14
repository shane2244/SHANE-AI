import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { stages } from "@/data/siteContent";

export default function JourneyPage() {
  return (
    <motion.div className="page journey-page" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <section className="page-intro">
        <p className="kicker" data-testid="journey-kicker">The path is not a ladder</p>
        <h1 data-testid="journey-heading">Three ways of<br /><em>coming home.</em></h1>
        <p data-testid="journey-description">Move through each stage at your own pace. Revisit what changes. Keep what stays true.</p>
      </section>
      <section className="stage-list">
        {stages.map((stage, index) => (
          <article key={stage.number} className={`stage-row ${index === 0 ? "current" : ""}`} style={{ "--stage-color": stage.color }} data-testid={`journey-stage-${stage.number}`}>
            <span className="stage-number">{stage.number}</span>
            <div><p className="kicker">{index === 0 ? "You are here" : `Opens after stage ${index}`}</p><h2>{stage.title}</h2><p>{stage.text}</p></div>
            <div className="stage-status">{index === 0 ? <Check /> : <span>{index + 1}</span>}</div>
          </article>
        ))}
      </section>
      <section className="journey-cta"><div><p className="kicker">Stage 01 · First practice</p><h2>Begin with the story you tell about yourself.</h2></div><Link to="/companion" data-testid="start-first-practice-link">Start practice <ArrowRight /></Link></section>
    </motion.div>
  );
}