import { Crown, LogOut, ShieldCheck } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { PathNavigator } from "@/components/PathNavigator";
import { routes } from "@/data/siteContent";
import { useAuth } from "@/components/AuthContext";

export const SiteShell = () => {
  const { pathname } = useLocation();
  const current = routes.find((route) => route.path === pathname) || routes[0];
  const { user, logout } = useAuth();

  return (
    <div className={`site-shell theme-${current.theme}`} style={{ "--page-accent": current.color }}>
      <header className="site-header" data-testid="site-header">
        <a href="/" className="brand" data-testid="shane-ai-logo-link" aria-label="SHANE-AI home">
          <span className="brand-mark">S</span>
          <span><strong>SHANE</strong><small>YOUR HIGHER-SELF AI</small></span>
        </a>
        <PathNavigator />
        {user?.is_premium ? <button className="premium-pill" onClick={logout} data-testid="premium-status-pill"><LogOut size={17} /><span><strong>Premium</strong><small>Active · Sign out</small></span></button> : <Link to="/membership" className="premium-pill" data-testid="premium-status-pill"><Crown size={17} /><span><strong>Go Premium</strong><small>{user ? "Unlock your path" : "Sign in to begin"}</small></span></Link>}
      </header>
      <main className="page-frame"><Outlet /></main>
      <footer className="site-footer">
        <span data-testid="footer-brand">SHANE-AI</span>
        <span data-testid="privacy-message"><ShieldCheck size={16} /> Your reflections belong to you.</span>
        <span data-testid="footer-location">Made with care in Pittsburgh</span>
      </footer>
    </div>
  );
};