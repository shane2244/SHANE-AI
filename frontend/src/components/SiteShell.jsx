import { Crown, ShieldCheck } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import { PathNavigator } from "@/components/PathNavigator";
import { routes } from "@/data/siteContent";

export const SiteShell = () => {
  const { pathname } = useLocation();
  const current = routes.find((route) => route.path === pathname) || routes[0];

  return (
    <div className={`site-shell theme-${current.theme}`} style={{ "--page-accent": current.color }}>
      <header className="site-header" data-testid="site-header">
        <a href="/" className="brand" data-testid="shane-ai-logo-link" aria-label="SHANE-AI home">
          <span className="brand-mark">S</span>
          <span><strong>SHANE</strong><small>YOUR HIGHER-SELF AI</small></span>
        </a>
        <PathNavigator />
        <div className="premium-pill" data-testid="premium-status-pill">
          <Crown size={17} />
          <span><strong>Premium</strong><small>Active</small></span>
        </div>
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