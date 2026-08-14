import { BookOpenText, Compass, House, LibraryBig, MessagesSquare, Sparkles } from "lucide-react";

export const routes = [
  { path: "/", label: "Today", eyebrow: "Your daily return", icon: House, color: "#F1C75B", theme: "sun" },
  { path: "/journey", label: "The Path", eyebrow: "Three stages", icon: Compass, color: "#FF7A67", theme: "coral" },
  { path: "/companion", label: "Companion", eyebrow: "Reflect together", icon: MessagesSquare, color: "#56CFE1", theme: "aqua" },
  { path: "/tarot", label: "Tarot Play", eyebrow: "Meet the mirror", icon: Sparkles, color: "#D9A7FF", theme: "violet" },
  { path: "/journal", label: "Journal", eyebrow: "Keep what matters", icon: BookOpenText, color: "#75D19C", theme: "green" },
  { path: "/wisdom", label: "Wisdom", eyebrow: "Explore the unseen", icon: LibraryBig, color: "#FF9E64", theme: "ember" },
];

export const stages = [
  { number: "01", title: "Self-Realization", text: "Meet your patterns, values, inner language, and natural rhythms without reducing yourself to a label.", color: "#F1C75B" },
  { number: "02", title: "Self & Other", text: "Explore projection, relationship, and the places where your story touches the lives around you.", color: "#56CFE1" },
  { number: "03", title: "Life Purpose", text: "Bring self-knowledge into motion through meaningful choices, creative work, and everyday contribution.", color: "#FF7A67" },
];

export const prompts = [
  "What part of me is asking to be heard today?",
  "Where am I choosing familiarity over aliveness?",
  "What would a kinder interpretation make possible?",
];