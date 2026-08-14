import { BookOpenText, Compass, Eye, Fingerprint, HeartHandshake, House, LibraryBig, MessagesSquare, Network, Sparkles, Waves } from "lucide-react";

export const routes = [
  { path: "/", label: "Today", eyebrow: "Start here", icon: House, color: "#FFE24A", theme: "sun", depth: "begin" },
  { path: "/knowledge", label: "The Atlas", eyebrow: "Search everything", icon: Network, color: "#FF7900", theme: "ember", depth: "begin" },
  { path: "/journey", label: "The Path", eyebrow: "Three simple steps", icon: Compass, color: "#FF7900", theme: "coral", depth: "begin" },
  { path: "/app/discovery", label: "Discovery", eyebrow: "Your plain-English map", icon: Fingerprint, color: "#C86BFF", theme: "lilac", depth: "begin" },
  { path: "/companion", label: "Companion", eyebrow: "Talk it through", icon: MessagesSquare, color: "#2FFFE0", theme: "aqua", depth: "begin" },
  { path: "/tarot", label: "Tarot Play", eyebrow: "Reflect through symbols", icon: Sparkles, color: "#9B7BFF", theme: "violet", depth: "begin" },
  { path: "/app/sacral", label: "Sacral", eyebrow: "Deep embodied practice", icon: Waves, color: "#FF7900", theme: "teal", depth: "deep" },
  { path: "/journal", label: "Journal", eyebrow: "Keep what matters", icon: BookOpenText, color: "#55FF8A", theme: "green", depth: "begin" },
  { path: "/app/traditions", label: "Traditions", eyebrow: "Deep study atlas", icon: LibraryBig, color: "#FF7900", theme: "ember", depth: "deep" },
  { path: "/app/meanings", label: "Meanings", eyebrow: "Everyday signs", icon: Eye, color: "#7A1730", theme: "rose", depth: "begin" },
  { path: "/app/connections", label: "Connections", eyebrow: "Everyday relationships", icon: HeartHandshake, color: "#39A7FF", theme: "sky", depth: "begin" },
];

export const stages = [
  { number: "01", title: "Self-Realization", text: "Meet your patterns through astrology, numerology, Human Design, Chinese astrology, and Kabbalah.", color: "#F1C75B" },
  { number: "02", title: "Self & Other", text: "Explore projection, relationship, and the places where your story touches the lives around you.", color: "#56CFE1" },
  { number: "03", title: "Life Purpose", text: "Bring self-knowledge into motion through meaningful choices, creative work, and everyday contribution.", color: "#FF7A67" },
];

export const prompts = ["What part of me is asking to be heard today?", "Where am I choosing familiarity over aliveness?", "What would a kinder interpretation make possible?"];