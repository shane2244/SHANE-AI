import { Crown, LogOut, ShieldCheck } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { PathNavigator } from "@/components/PathNavigator";
import { routes } from "@/data/siteContent";
import { useAuth } from "@/components/AuthContext";
import { KnowledgeSearch } from "@/components/KnowledgeSearch";
import { useEffect } from "react";

export const SiteShell = () => {
  const { pathname } = useLocation();
  const current = routes.find((route) => route.path === pathname) || routes[0];
  const { user, logout } = useAuth();
  useEffect(() => { document.title = current.path === "/" ? "SHANE-AI — Higher-Self Companion & Spirituality Atlas" : `${current.label} | SHANE-AI`; }, [current.label, current.path]);

  return (
    <div className={`site-shell theme-${current.theme}`} style={{ "--page-accent": current.color }}>
      <a href="#main-content" className="skip-link" data-testid="skip-to-content-link">Skip to content</a><header className="site-header" data-testid="site-header">
        <a href="/" className="brand" data-testid="shane-ai-logo-link" aria-label="SHANE-AI home">
          <img src="/shane-ai-logo.png" alt="SHANE-AI" data-testid="shane-ai-main-logo" />
        </a>
        <PathNavigator />
        <div className="header-actions"><KnowledgeSearch/>{user?.is_premium ? <button className="premium-pill" onClick={logout} data-testid="premium-status-pill"><LogOut size={17} /><span><strong>Premium</strong><small>Active · Sign out</small></span></button> : <Link to="/membership" className="premium-pill" data-testid="premium-status-pill"><Crown size={17} /><span><strong>Go Premium</strong><small>{user ? "Unlock your path" : "Sign in to begin"}</small></span></Link>}</div>
      </header>
      <main className="page-frame" id="main-content"><Outlet /></main>
      <footer className="site-footer">
        <span data-testid="footer-brand">SHANE-AI</span>
        <span data-testid="privacy-message"><ShieldCheck size={16} /> Your reflections belong to you.</span>
        <Link to="/methods" data-testid="methods-link">Methods & accuracy</Link>
        <span data-testid="footer-signature">Higher self · Human first</span>
      </footer>
    </div>
  );
};