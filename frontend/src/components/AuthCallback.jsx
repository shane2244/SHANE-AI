import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const AuthCallback = () => {
  const location = useLocation(); const navigate = useNavigate(); const { setUser } = useAuth();
  const processed = useRef(false); const [error, setError] = useState("");
  useEffect(() => {
    if (processed.current) return; processed.current = true;
    const sessionId = new URLSearchParams(location.hash.replace("#", "")).get("session_id");
    fetch(`${API}/auth/session`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: sessionId }) })
      .then(async (response) => { if (!response.ok) throw new Error("Sign-in could not be completed"); return response.json(); })
      .then((user) => { setUser(user); navigate("/app/discovery", { replace: true }); })
      .catch((requestError) => setError(requestError.message));
  }, [location.hash, navigate, setUser]);
  return <main className="auth-callback" data-testid="auth-callback-state"><div className="brand-mark">S</div><h1>{error || "Opening your SHANE-AI space…"}</h1>{error && <button onClick={() => navigate("/membership")} data-testid="auth-callback-return-button">Return to membership</button>}</main>;
};