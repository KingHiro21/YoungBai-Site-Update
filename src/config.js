import {
  Zap, ShieldCheck, Swords, Users, TrendingUp, Gift, Trophy, Crown,
} from "lucide-react";

/* ════════════════════════════════════════════════════════════
   YOUNGBAI SITE CONFIG
   Everything editable lives in this one file: links, pricing,
   stats, FAQ, testimonials, rank images, service tabs.
   ════════════════════════════════════════════════════════════ */

export const SITE_CONFIG = {
  brandName: "YOUNGBAI",
  tagline: "FAST. RELIABLE. BUILT TO CLIMB.",
  descriptor: "Dota 2 Boosting & Gaming Community",
  seo: {
    title: "Youngbai | Dota 2 Boosting & Gaming Community",
    description:
      "Youngbai provides Dota 2 Solo and Party MMR boosting, plus tournaments, giveaways, prizes and a gaming community on Discord.",
  },
  socialLinks: {
    discord: "https://discord.gg/thaDTdX9mT",
  },
  currency: "₱",
  mmrPerWin: 25, // used for the approx. per-win estimates + calculator
};

export const SOLO_PRICING = [
  { label: "0 – 2,000", min: 0, max: 2000, per100: 350, perWin: 90 },
  { label: "2,000 – 3,000", min: 2000, max: 3000, per100: 450, perWin: 115 },
  { label: "3,000 – 4,000", min: 3000, max: 4000, per100: 600, perWin: 150 },
  { label: "4,000 – 5,000", min: 4000, max: 5000, per100: 800, perWin: 200 },
  { label: "5,000 – 6,000", min: 5000, max: 6000, per100: 1100, perWin: 275, premium: true },
  { label: "6,000 – 7,000", min: 6000, max: 7000, per100: 1500, perWin: 375, premium: true },
  { label: "7,000 – 8,000", min: 7000, max: 8000, per100: 2000, perWin: 500 },
  { label: "8,000 – 9,000", min: 8000, max: 9000, per100: 2500, perWin: 625 },
];

export const PARTY_PRICING = [
  { label: "0 – 3K", min: 0, max: 3000, perWin: 160 },
  { label: "3K – 3.85K", min: 3000, max: 3850, perWin: 210 },
  { label: "3.85K – 4.65K", min: 3850, max: 4650, perWin: 210 },
  { label: "4.65K – 5.64K", min: 4650, max: 5650, perWin: 315 },
  { label: "5.65K – 6.5K", min: 5650, max: 6500, perWin: 520, premium: true },
  { label: "6.5K – 7K", min: 6500, max: 7000, perWin: 575, premium: true },
];

export const BOOST_ADDONS = [
  { id: "priority", label: "Express priority", desc: "Your order jumps the queue", pct: 20 },
  { id: "heroes", label: "Preferred heroes", desc: "Booster plays from your hero pool", pct: 10 },
];

export const PAYMENT_METHODS = ["GCash", "Maya", "Bank transfer", "PayPal"];

export const ORDER_OPTIONS = {
  servers: ["SEA", "Europe", "US East", "US West"],
  queues: ["Ranked Roles", "Ranked Classic"],
};

export const SHIELD_POINTS = [
  "You confirm the final price with Youngbai before any games are played.",
  "Progress updates while the boost runs — you always know where it stands.",
  "Party boosting is billed per win: no win, no charge for that game.",
  "Everything is coordinated in Discord, so there's a written record of the order.",
];

export const RANKS = [
  { name: "Herald", minMmr: 0, color: "#7d8a93", img: "" },
  { name: "Guardian", minMmr: 800, color: "#4caf7d", img: "" },
  { name: "Crusader", minMmr: 1600, color: "#3aa9a0", img: "" },
  { name: "Archon", minMmr: 2400, color: "#3a7bd5", img: "" },
  { name: "Legend", minMmr: 3100, color: "#7b5cd6", img: "" },
  { name: "Ancient", minMmr: 3900, color: "#c05cd6", img: "" },
  { name: "Divine", minMmr: 4600, color: "#d9a94c", img: "" },
  { name: "Immortal", minMmr: 5600, color: "#ff3247", img: "" },
];

export const SERVICE_TABS = [
  { id: "solo", label: "Solo Boost", icon: "target" },
  { id: "party", label: "Party Boost", icon: "users" },
  { id: "calibration", label: "Calibration", icon: "crosshair", soon: true },
  { id: "lowprio", label: "Low Priority", icon: "lock", soon: true },
  { id: "coaching", label: "Coaching", icon: "graduation", soon: true },
];

/* Social channels. Icon keys: facebook, instagram, tiktok, whatsapp,
   wechat, discord. Entries with an href render as links; entries with
   only "info" (like WeChat, which has no public profile URL) render as
   a hoverable badge showing the ID. Add/remove lines freely. */
export const SOCIALS = [
  { id: "fb-main", label: "Main Facebook", icon: "facebook",
    href: "https://facebook.com/legsharthart" },
  { id: "fb-page", label: "Facebook Page", icon: "facebook",
    href: "https://facebook.com/ashdotes22" },
  { id: "tiktok", label: "TikTok", icon: "tiktok",
    href: "https://www.tiktok.com/@youngbaidota" },
  { id: "instagram", label: "Instagram", icon: "instagram",
    href: "https://www.instagram.com/ybdotes/" },
  { id: "whatsapp", label: "WhatsApp", icon: "whatsapp",
    href: "https://wa.me/639122900598" },
  { id: "wechat", label: "WeChat", icon: "wechat",
    info: "Youngbai · 0912 290 0598" },
  { id: "discord", label: "Discord", icon: "discord",
    href: "https://discord.gg/thaDTdX9mT" },
];

export const rankForMmr = (mmr) =>
  [...RANKS].reverse().find((r) => mmr >= r.minMmr) || RANKS[0];

export const HERO_STATS = [
  { value: "500+", label: "Games completed" },
  { value: "90%+", label: "Win rate" },
  { value: "Fast", label: "Queue times" },
  { value: "Trusted", label: "Community" },
];

export const COMMUNITY_STATS = [
  { to: 500, suffix: "+", label: "Games completed" },
  { to: 90, suffix: "%+", label: "Win rate" },
  { to: 1000, suffix: "+", label: "Community members" },
  { to: 50, suffix: "+", label: "Events hosted" },
];

export const WHY_CARDS = [
  { icon: Zap, title: "FAST", body: "Get your games done efficiently without unnecessary waiting." },
  { icon: ShieldCheck, title: "RELIABLE", body: "Clear pricing, communication, and progress updates." },
  { icon: Swords, title: "EXPERIENCED", body: "Play with experienced Dota 2 players who understand the grind." },
  { icon: Users, title: "COMMUNITY", body: "You're not just buying a boost. You're joining a community." },
  { icon: TrendingUp, title: "COMPETITIVE", body: "Improve your MMR and play alongside players who take Dota seriously." },
  { icon: Gift, title: "FUN", body: "Join events, tournaments, giveaways, and community games." },
];

export const HOW_IT_WORKS = [
  { step: "01", kicker: "Pick a lane", title: "CHOOSE YOUR BOOST", body: "Pick Solo or Party boosting based on how you want to climb." },
  { step: "02", kicker: "Say hello", title: "CONTACT YOUNGBAI", body: "Message Youngbai through Discord or the order channel." },
  { step: "03", kicker: "Lock it in", title: "START YOUR BOOST", body: "Share the details needed and the games begin." },
  { step: "04", kicker: "Watch it rise", title: "CLIMB THE RANKS", body: "Track progress until you hit your target MMR." },
];

export const DISCORD_CHANNELS = [
  { name: "general", active: false },
  { name: "dota-2", active: false },
  { name: "looking-for-party", active: true },
  { name: "tournaments", active: false },
  { name: "giveaways", active: false },
  { name: "boosting", active: false },
  { name: "announcements", active: false },
];

export const COMMUNITY_FEATURES = [
  "Find teammates", "Join community games", "Participate in tournaments",
  "Enter giveaways", "Win prizes", "Meet other Dota players",
  "Get announcements", "Contact Youngbai", "Find boosting opportunities",
];

export const TOURNAMENTS = [
  { icon: Trophy, title: "COMMUNITY TOURNAMENTS", body: "Compete against other players and prove your skill." },
  { icon: Crown, title: "PRIZE EVENTS", body: "Join special events and compete for exciting prizes." },
  { icon: Gift, title: "GIVEAWAYS", body: "Stay active in Discord for community giveaways and rewards." },
];

export const LEADERBOARD = [
  { rank: 1, name: "PlayerOne", pts: 1280 },
  { rank: 2, name: "Shadow", pts: 1145 },
  { rank: 3, name: "YoungKing", pts: 1090 },
  { rank: 4, name: "CarryMe", pts: 940 },
  { rank: 5, name: "MidDiff", pts: 875 },
];

export const TESTIMONIALS = [
  { quote: "Fast games and really smooth communication. Definitely coming back.",
    author: "Dota Player", stars: 5, chips: ["Swift delivery", "Prompt response"] },
  { quote: "I joined for boosting and stayed because the Discord community is actually fun.",
    author: "Community Member", stars: 5, chips: ["Community"] },
  { quote: "Party boosting was exactly what I wanted. Easy to coordinate through Discord.",
    author: "Ranked Player", stars: 5, chips: ["Party boost", "Clear communication"] },
];

export const FAQ_ITEMS = [
  { q: "What is Solo Boosting?", a: "A booster plays on your behalf and raises your MMR to the target you set. You don't need to be online, and you get progress updates as the climb goes." },
  { q: "What is Party Boosting?", a: "You queue and play together with the booster. You stay in control of your own account and get to learn from the games while you climb." },
  { q: "How does Party Boosting pricing work?", a: "Party boosting is charged per win. You only pay for games that are won, at the rate for your current MMR bracket." },
  { q: "How does Solo Boosting pricing work?", a: "Solo boosting is priced per 100 MMR. The rate depends on your current bracket — higher MMR takes more games and more skill, so the rate rises." },
  { q: "How do I place an order?", a: "Join the Discord and post in the boosting channel, or message Youngbai directly. Tell us your current MMR, your target, and whether you want Solo or Party." },
  { q: "How do I join the Discord?", a: "Use any Join Discord button on this page. The invite is open and free — you don't need to buy a boost to be part of the community." },
  { q: "Can I play with the booster?", a: "Yes — that's exactly what Party Boosting is for. You queue as a party and climb together." },
  { q: "How long does boosting take?", a: "It depends on your bracket and how much MMR you want. You get an estimate before starting, and updates while it runs." },
  { q: "Do you host tournaments?", a: "Yes. Community tournaments and prize events run regularly, and they're announced in Discord first." },
  { q: "How can I join giveaways?", a: "Stay active in the Discord. Giveaways are posted in the giveaways channel and are open to community members." },
];

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Boosting", href: "#boosting" },
  { label: "Solo Boost", href: "#solo" },
  { label: "Party Boost", href: "#party" },
  { label: "Community", href: "#community" },
  { label: "Tournaments", href: "#tournaments" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export const peso = (n) => SITE_CONFIG.currency + n.toLocaleString("en-PH");
