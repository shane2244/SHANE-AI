import { useState } from "react";
import { ArrowRight, Compass } from "lucide-react";
import { Link } from "react-router-dom";

const paths = [
  { id:"self", label:"Understand myself", title:"Begin with Discovery", text:"Open a plain-English preview of your astrology, numerology, Human Design, Chinese astrology, and Kabbalah maps.", route:"/app/discovery", color:"#C86BFF" },
  { id:"ground", label:"Feel more grounded", title:"Begin with the Companion", text:"Name what is present and receive a private reflection that returns the next step to you.", route:"/companion", color:"#2FFFE0" },
  { id:"meaning", label:"Understand a sign", title:"Begin with Meanings", text:"Explore numbers, animals, dreams, sensations, and synchronicities without forcing certainty.", route:"/app/meanings", color:"#FFE24A" },
  { id:"learn", label:"Learn spirituality", title:"Begin with the Atlas", text:"Move from approachable introductions into sourced traditions, metaphysics, and deep study.", route:"/knowledge", color:"#FF7900" },
  { id:"relationship", label:"Improve relationships", title:"Begin with Connections", text:"Explore projection, boundaries, communication, and the meeting point between self and other.", route:"/app/connections", color:"#39A7FF" },
];

export const StartCompass = () => {
  const [selected, setSelected] = useState(paths[0]);
  return <section className="start-compass" style={{"--compass-color":selected.color}} data-testid="start-compass-section"><div><Compass/><p className="kicker">New here? Start with one honest need.</p><h2>What brought you here today?</h2><div className="compass-options">{paths.map((path)=><button key={path.id} className={selected.id===path.id?"active":""} onClick={()=>setSelected(path)} data-testid={`start-compass-${path.id}-button`}>{path.label}</button>)}</div></div><article data-testid="start-compass-recommendation"><small>Your first path</small><h3>{selected.title}</h3><p>{selected.text}</p><Link to={selected.route} data-testid="start-compass-result-link">Take this path <ArrowRight/></Link></article></section>;
};