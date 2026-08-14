import { useMemo, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { knowledgeTopics } from "@/data/knowledgeIndex";

export const KnowledgeSearch = () => {
  const [open, setOpen] = useState(false); const [query, setQuery] = useState("");
  const results = useMemo(() => knowledgeTopics.filter((topic) => `${topic.title} ${topic.world} ${topic.summary}`.toLowerCase().includes(query.toLowerCase())).slice(0, 10), [query]);
  return <><button className="global-search-button" onClick={() => setOpen(true)} aria-label="Search the SHANE-AI atlas" data-testid="open-global-search-button"><Search/><span>Search</span></button>{open&&<div className="search-veil" role="dialog" aria-modal="true" data-testid="global-search-dialog"><div className="search-panel"><header><div><p className="kicker">Search the whole universe</p><h2>What are you trying to understand?</h2></div><button onClick={()=>setOpen(false)} aria-label="Close search" data-testid="close-global-search-button"><X/></button></header><div className="search-input"><Search/><input autoFocus value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Try awakening, dreams, Kabbalah, energy…" data-testid="global-search-input"/><span>{results.length} paths</span></div><div className="global-results" data-testid="global-search-results">{results.map((topic,index)=><Link key={topic.title} to={topic.route} onClick={()=>setOpen(false)} data-testid={`global-search-result-${index+1}`}><span><small>{topic.world} · {topic.lens}</small><strong>{topic.title}</strong><p>{topic.summary}</p></span><ArrowRight/></Link>)}</div></div></div>}</>;
};