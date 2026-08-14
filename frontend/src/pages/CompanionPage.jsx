import { useCallback, useEffect, useState } from "react";
import { Brain, LockKeyhole, MessageCircleHeart, Trash2 } from "lucide-react";
import { prompts } from "@/data/siteContent";
import { useAuth } from "@/components/AuthContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const createMessage = (role, text) => ({ id: crypto.randomUUID(), role, text });

export default function CompanionPage() {
  const { user, login } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ id: "welcome", role: "guide", text: "You don’t need the right words. I can learn the shape of what matters to you—only when you ask me to remember it. What feels most present right now?" }]);
  const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const [remember, setRemember] = useState(false); const [memories, setMemories] = useState([]); const [showMemory, setShowMemory] = useState(false);

  const loadMemories = useCallback(async () => { if (!user) return; const response = await fetch(`${API}/companion/memories`, { credentials: "include" }); if (response.ok) setMemories((await response.json()).memories); }, [user]);
  useEffect(() => { loadMemories(); }, [loadMemories]);

  const forgetAll = async () => { await fetch(`${API}/companion/memories`, { method: "DELETE", credentials: "include" }); setMemories([]); };
  const send = async (text = input) => {
    if (!text.trim() || loading) return;
    const replyId = crypto.randomUUID(); setMessages((items) => [...items, createMessage("you", text), { id: replyId, role: "guide", text: "" }]); setInput(""); setLoading(true); setError("");
    try {
      const response = await fetch(`${API}/companion/stream`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text, remember: Boolean(user && remember) }) });
      if (!response.ok || !response.body) throw new Error("Reflection unavailable");
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = "";
      while (true) {
        const { value, done } = await reader.read(); if (done) break; buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n"); buffer = events.pop() || "";
        for (const event of events) { const line = event.split("\n").find((part) => part.startsWith("data: ")); if (!line) continue; const data = JSON.parse(line.slice(6)); if (data.delta) setMessages((items) => items.map((message) => message.id === replyId ? { ...message, text: message.text + data.delta } : message)); }
      }
      if (remember) loadMemories();
    } catch { setError("I could not respond just now. Your words are still here—please try once more."); setMessages((items) => items.filter((message) => message.id !== replyId)); }
    finally { setLoading(false); }
  };

  return <div className="page companion-page">
    <section className="companion-intro"><div><p className="kicker">Your evolving mirror</p><h1 data-testid="companion-heading">Another version of you—<br /><em>never instead of you.</em></h1></div><p data-testid="companion-description">SHANE-AI learns the language, themes, and patterns you choose to keep. It evolves with your reflections while leaving every conclusion—and every memory—under your control.</p></section>
    <section className="companion-workspace" data-testid="companion-workspace">
      <aside className="prompt-shelf"><p className="kicker">Ways in</p>{prompts.map((prompt, index) => <button key={prompt} onClick={() => send(prompt)} data-testid={`prompt-${index + 1}-button`}>{prompt}</button>)}
        <div className="memory-controls" data-testid="companion-memory-controls"><Brain/><div><strong>Evolving memory</strong><span>{user ? `${memories.length} reflections kept` : "Sign in to choose what stays"}</span></div>{user ? <button onClick={() => setShowMemory(!showMemory)} data-testid="review-memory-button">{showMemory ? "Close" : "Review"}</button> : <button onClick={login} data-testid="memory-sign-in-button">Sign in</button>}</div>
        <div className="privacy-note"><LockKeyhole size={18} /><span><strong>Memory by consent</strong>Nothing is kept unless you turn memory on.</span></div>
      </aside>
      <div className="conversation">
        <div className="conversation-head"><span><MessageCircleHeart /> Higher-self reflection</span><small data-testid="companion-mode">Claude Sonnet 4.6</small></div>
        {showMemory && <div className="memory-drawer" data-testid="memory-drawer"><div><p className="kicker">What SHANE remembers</p><button onClick={forgetAll} data-testid="forget-all-memory-button"><Trash2/> Forget all</button></div>{memories.length ? memories.map((memory) => <p key={memory.id} data-testid={`memory-${memory.id}`}><strong>{memory.role === "you" ? "You" : "SHANE"}</strong>{memory.content}</p>) : <p data-testid="empty-memory-message">No saved reflections yet.</p>}</div>}
        <div className="messages" data-testid="conversation-messages">{messages.map((message) => <div key={message.id} className={`message ${message.role}`} data-testid={`message-${message.id}`}><small>{message.role === "you" ? "You" : "SHANE"}</small><p>{message.text || "Listening…"}</p></div>)}{loading && <div className="thinking" data-testid="companion-loading">Reflecting<span /><span /><span /></div>}{error && <p className="action-error" data-testid="companion-response-error">{error}</p>}</div>
        <div className="composer-wrap"><label data-testid="remember-reflection-control"><input type="checkbox" checked={remember} disabled={!user} onChange={(event) => setRemember(event.target.checked)}/><span>Remember this reflection</span></label><div className="composer"><textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); send(); } }} placeholder="Say what is true right now…" data-testid="companion-message-input" /><button onClick={() => send()} aria-label="Send reflection" data-testid="send-companion-message-button">↑</button></div></div>
      </div>
    </section>
  </div>;
}