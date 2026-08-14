import { useEffect, useState } from "react";
import axios from "axios";
import { BookHeart, Save } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function JournalPage() {
  const [entries, setEntries] = useState([]); const [title, setTitle] = useState(""); const [content, setContent] = useState(""); const [saved, setSaved] = useState(false); const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/journals`, { signal: controller.signal })
      .then((result) => result.json())
      .then((payload) => setEntries(payload))
      .catch((requestError) => { if (requestError.name !== "AbortError") setError("Recent reflections could not be loaded."); });
    return () => controller.abort();
  }, []);
  const save = async () => { if (!title.trim() || !content.trim()) { setError("Add both a title and reflection before saving."); return; } try { setError(""); const { data } = await axios.post(`${API}/journals`, { title, content, prompt: "What part of this moment do I want to remember?" }); setEntries((items) => [data, ...items]); setTitle(""); setContent(""); setSaved(true); setTimeout(() => setSaved(false), 1800); } catch { setError("Your reflection could not be saved. Please try again in a moment."); } };
  return (
    <div className="page journal-page">
      <section className="journal-intro"><div><p className="kicker">Your living record</p><h1 data-testid="journal-heading">Keep the words that<br /><em>bring you closer.</em></h1></div><p data-testid="journal-description">Your journal grows with the journey—capturing turning points, recurring patterns, and truths worth returning to.</p></section>
      <section className="journal-layout">
        <div className="journal-editor" data-testid="journal-editor"><div className="editor-meta"><BookHeart /><span>Today’s page</span><small>{new Date().toLocaleDateString(undefined, { month: "long", day: "numeric" })}</small></div><p className="journal-prompt" data-testid="journal-prompt">What part of this moment do I want to remember?</p><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give this reflection a name" data-testid="journal-title-input" /><textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write without editing yourself…" data-testid="journal-content-input" />{error && <p className="action-error" data-testid="journal-save-error">{error}</p>}<button onClick={save} data-testid="save-journal-entry-button"><Save size={17} />{saved ? "Reflection saved" : "Save reflection"}</button></div>
        <aside className="entry-list" data-testid="journal-entry-list"><p className="kicker">Recent reflections</p><h2>{entries.length ? `${entries.length} notes kept` : "A fresh first page"}</h2>{entries.length ? entries.slice(0, 4).map((entry) => <article key={entry.id} data-testid={`journal-entry-${entry.id}`}><small>{new Date(entry.created_at).toLocaleDateString()}</small><h3>{entry.title}</h3><p>{entry.content}</p></article>) : <div className="empty-entry"><BookHeart /><p>Your saved reflections will gather here as a quiet map of what has mattered.</p></div>}</aside>
      </section>
    </div>
  );
}