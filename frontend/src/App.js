import "@/App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SiteShell } from "@/components/SiteShell";
import TodayPage from "@/pages/TodayPage";
import JourneyPage from "@/pages/JourneyPage";
import CompanionPage from "@/pages/CompanionPage";
import TarotPage from "@/pages/TarotPage";
import JournalPage from "@/pages/JournalPage";
import WisdomPage from "@/pages/WisdomPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteShell />}>
          <Route path="/" element={<TodayPage />} />
          <Route path="/journey" element={<JourneyPage />} />
          <Route path="/companion" element={<CompanionPage />} />
          <Route path="/tarot" element={<TarotPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/wisdom" element={<WisdomPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}