import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { routes } from "@/data/siteContent";

export const PathNavigator = () => (
  <nav className="path-rail" aria-label="Explore SHANE-AI" data-testid="path-navigator">
    <div className="path-rail-track">
      {routes.map(({ path, label, eyebrow, icon: Icon, color }) => (
        <NavLink
          key={path}
          to={path}
          end={path === "/"}
          className={({ isActive }) => `path-stop ${isActive ? "is-active" : ""}`}
          style={{ "--stop-color": color }}
          data-testid={`nav-${label.toLowerCase().replaceAll(" ", "-")}-link`}
        >
          {({ isActive }) => (
            <>
              {isActive && <motion.span layoutId="active-path" className="active-path" />}
              <span className="path-icon"><Icon size={22} strokeWidth={1.8} /></span>
              <span className="path-copy">
                <strong>{label}</strong>
                <small>{eyebrow}</small>
              </span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  </nav>
);