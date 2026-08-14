import "@/App.css";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "@/components/AuthContext";
import { AuthCallback } from "@/components/AuthCallback";
import { SiteShell } from "@/components/SiteShell";
import TodayPage from "@/pages/TodayPage";
import JourneyPage from "@/pages/JourneyPage";
import CompanionPage from "@/pages/CompanionPage";
import TarotPage from "@/pages/TarotPage";
import JournalPage from "@/pages/JournalPage";
import WisdomPage from "@/pages/WisdomPage";
import MeaningsPage from "@/pages/MeaningsPage";
import BlueprintPage from "@/pages/BlueprintPage";
import SacralPage from "@/pages/SacralPage";
import MembershipPage from "@/pages/MembershipPage";
import PaymentSuccessPage from "@/pages/PaymentSuccessPage";
import MemberAccessPage from "@/pages/MemberAccessPage";
import TraditionsPage from "@/pages/TraditionsPage";
import KnowledgeAtlasPage from "@/pages/KnowledgeAtlasPage";

function AppRoutes() {
  const location = useLocation();
  if (location.hash?.includes("session_id=")) return <AuthCallback />;
  return (
    <Routes>
      <Route element={<SiteShell />}>
        <Route path="/" element={<TodayPage />} />
        <Route path="/journey" element={<JourneyPage />} />
        <Route path="/knowledge" element={<KnowledgeAtlasPage />} />
        <Route path="/blueprint" element={<Navigate to="/app/discovery" replace />} />
        <Route path="/app/discovery" element={<BlueprintPage />} />
        <Route path="/companion" element={<CompanionPage />} />
        <Route path="/tarot" element={<TarotPage />} />
        <Route path="/app/sacral" element={<SacralPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/wisdom" element={<WisdomPage />} />
        <Route path="/app/traditions" element={<TraditionsPage />} />
        <Route path="/meanings" element={<Navigate to="/app/meanings" replace />} />
        <Route path="/app/meanings" element={<MeaningsPage />} />
        <Route path="/app/connections" element={<JourneyPage />} />
        <Route path="/membership" element={<MembershipPage />} />
        <Route path="/member" element={<MemberAccessPage />} />
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return <BrowserRouter><AuthProvider><AppRoutes /></AuthProvider></BrowserRouter>;
}