import { useState } from "react";
import axios from "axios";
import { ArrowUp, LockKeyhole, MessageCircleHeart } from "lucide-react";
import { prompts } from "@/data/siteContent";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CompanionPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ role: "guide", text: "You don’t need to arrive with the right words. What feels most present in you right now?" }]);
  const [loading, setLoading] = useState(false);

  const send = async (text = input) => {
    if (!text.trim() || loading) return;
    setMessages((items) => [...items, { role: "you", text }]); setInput(""); setLoading(true);
    try {
      const { data } = await axios.post(`${API}/companion`, { message: text });
      setMessages((items) => [...items, { role: "guide", text: `${data.response} ${data.invitation}` }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="page companion-page">
      <section className="companion-intro"><div><p className="kicker">The empathetic companion</p><h1 data-testid="companion-heading">A conversation<br /><em>without performance.</em></h1></div><p data-testid="companion-description">Reflect aloud with a guide designed to notice patterns, offer gentler perspectives, and return the knowing to you.</p></section>
      <section className="companion-workspace" data-testid="companion-workspace">
        <aside className="prompt-shelf"><p className="kicker">Ways in</p>{prompts.map((prompt, index) => <button key={prompt} onClick={() => send(prompt)} data-testid={`prompt-${index + 1}-button`}>{prompt}</button>)}<div className="privacy-note"><LockKeyhole size={18} /><span><strong>Private by design</strong>Your reflection space is treated as personal.</span></div></aside>
        <div className="conversation">
          <div className="conversation-head"><span><MessageCircleHeart /> Higher-self reflection</span><small data-testid="companion-mode">Guided mode</small></div>
          <div className="messages" data-testid="conversation-messages">{messages.map((message, index) => <div key={index} className={`message ${message.role}`} data-testid={`message-${index + 1}`}><small>{message.role === "you" ? "You" : "SHANE"}</small><p>{message.text}</p></div>)}{loading && <div className="thinking" data-testid="companion-loading">Listening<span /><span /><span /></div>}</div>
          <div className="composer"><textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); send(); } }} placeholder="Say what is true right now…" data-testid="companion-message-input" /><button onClick={() => send()} aria-label="Send reflection" data-testid="send-companion-message-button"><ArrowUp /></button></div>
        </div>
      </section>
    </div>
  );
}