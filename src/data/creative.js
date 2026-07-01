// ═══════════════════════════════════════════════════════════════════
// CREATIVE.JS — Photography, Videos, Stories, Travel, Sports
// Replace placeholder URLs with your real content when ready
// ═══════════════════════════════════════════════════════════════════

// ─── Photography ────────────────────────────────────────────────────
// Replace src with your actual image URLs or relative paths like '/photos/big-sur.jpg'
export const PHOTOS = [
  { src: 'https://picsum.photos/seed/bigsur/800/500',    title: 'Big Sur',         location: 'California', year: '2025' },
  { src: 'https://picsum.photos/seed/vegas/800/500',     title: 'Vegas Nights',    location: 'Las Vegas',  year: '2025' },
  { src: 'https://picsum.photos/seed/sedona/800/500',    title: 'Red Rocks',       location: 'Sedona, AZ', year: '2024' },
  { src: 'https://picsum.photos/seed/sfo/800/500',       title: 'Golden Gate',     location: 'San Francisco', year: '2025' },
  { src: 'https://picsum.photos/seed/savannah/800/500',  title: 'Moss & Oak',      location: 'Savannah, GA', year: '2025' },
  { src: 'https://picsum.photos/seed/page/800/500',      title: 'Horseshoe Bend',  location: 'Page, AZ',   year: '2024' },
  { src: 'https://picsum.photos/seed/hilton/800/500',    title: 'Atlantic Shore',  location: 'Hilton Head', year: '2025' },
  { src: 'https://picsum.photos/seed/flagstaff/800/500', title: 'Ponderosa',       location: 'Flagstaff, AZ', year: '2024' },
  { src: 'https://picsum.photos/seed/santamonica/800/500', title: 'Pier at Dusk',  location: 'Santa Monica', year: '2025' },
  { src: 'https://picsum.photos/seed/atlanta/800/500',   title: 'Downtown ATL',    location: 'Atlanta, GA', year: '2025' },
];

// ─── Videos ─────────────────────────────────────────────────────────
// Replace youtubeId with your actual YouTube video IDs
export const VIDEOS = [
  {
    title: 'Big Sur Road Trip',
    description: 'Aerial and ground footage from the Pacific Coast Highway drive through Big Sur.',
    youtubeId: 'dQw4w9WgXcQ',   // ← replace with your video ID
    duration: '3:24',
    year: '2025',
    tags: ['Travel', 'Cinematic'],
  },
  {
    title: 'Arizona Desert Series',
    description: 'Sedona red rocks, Page slot canyons, and Flagstaff pine forests.',
    youtubeId: 'dQw4w9WgXcQ',   // ← replace
    duration: '5:10',
    year: '2024',
    tags: ['Travel', 'Nature'],
  },
  {
    title: 'Atlanta + Savannah',
    description: 'Street photography, Spanish moss, and the charm of the deep South.',
    youtubeId: 'dQw4w9WgXcQ',   // ← replace
    duration: '4:02',
    year: '2025',
    tags: ['City', 'Travel'],
  },
];

// ─── Stories ────────────────────────────────────────────────────────
export const STORIES = [
  {
    title: 'The Last Signal',
    genre: 'Science Fiction',
    year: '2024',
    excerpt: 'In a world where networks had replaced memory, one engineer found the last unconnected node...',
    readTime: '8 min',
    // Full story — replace with your actual text
    body: `The last packet left the relay at 03:47 UTC. No one was watching the logs anymore — everyone had migrated to the mesh. Everyone except Arjun.

He sat in the server room not because he had to, but because the hum of physical hardware was the only sound left that felt honest. The mesh didn't hum. The mesh didn't make any sound at all.

"Signal integrity nominal," said the terminal. It always said that. Even when it wasn't true.

Arjun had been writing the same line of code for three weeks. Not because it was complex — it was four characters — but because once he wrote it, the last physical relay would route its final packet and go dark. And then there would be nothing left that wasn't the mesh.

He thought about his grandfather, who had worked at BSNL when it was still towers and copper and human beings climbing things. Who had told him once that the best networks were the ones you could touch.

He typed the four characters.

He did not press Enter.

Outside, the desert was doing what deserts do at night — cooling, contracting, whispering in frequencies no protocol had ever named.

He pressed Enter.

The terminal said: SIGNAL LOST.

For the first time in a long time, Arjun smiled.`,
  },
  {
    title: 'Coordinates Unknown',
    genre: 'Travel Essay',
    year: '2025',
    excerpt: 'Some places you visit. Some places visit you. Big Sur is the second kind...',
    readTime: '5 min',
    body: `The GPS lost signal somewhere around mile marker 63 on Highway 1. I didn't notice for twenty minutes because I was watching the Pacific do something I had no name for — not crashing, not surging, just existing at a scale that made the word "ocean" feel insufficient.

Big Sur doesn't let you take good photos of it. I tried. Every frame looked like a postcard of itself, flattened, drained of the thing that made you pull over and stand there with your hands in your pockets saying nothing.

The best moment was a Tuesday at 6am when the fog was so thick the road ahead looked like it ended at a white wall. I drove into it anyway. That felt like something.

Later I found a coffee place with no WiFi and no cell service and ate a breakfast burrito the size of a small animal and talked to a man who had been driving the same stretch of 1 for thirty years, back and forth, because he said the road remembered him.

I think I know what he meant now.

Some data you can't compress. Some coordinates don't resolve. Some places require you to be physically, stubbornly present — no latency, no cache, no abstraction layer between you and the thing itself.

Big Sur is the thing itself.`,
  },
  {
    title: 'The Elo of Everything',
    genre: 'Personal Essay',
    year: '2024',
    excerpt: 'Chess taught me that every decision has a rating, and most of mine started around 800...',
    readTime: '6 min',
    body: `I learned chess the wrong way. I learned the pieces first — their names, their ranges, their special moves — and then I learned the rules, and then I played and lost constantly for six months and thought I was bad at thinking.

What I was actually bad at was patience.

Chess is not a game about intelligence. It's a game about the willingness to sit with uncertainty and not flinch. Every position on the board is a compressed history of decisions, and the board doesn't care why you made them — only that you did.

My Elo started at around 800. For context, 800 is the rating the system assigns to new players before it has enough information to know what you are. It is a number that means: unknown.

I liked that. I spent a few months being unknown. Losing to gambits I'd never seen. Losing to people who moved faster than I thought possible. Losing to people who moved slower than I thought possible and somehow that was worse.

Around 1100 I started to see patterns. Not chess patterns — life patterns. The way I played when I was nervous (too fast). The way I played when I was confident (not carefully enough). The way I abandoned good positions because I got bored and wanted something to happen.

I'm somewhere around 1400 now. The Elo of everything, I've decided, is just a measure of how long you're willing to pay attention.`,
  },
];

// ─── Travel ─────────────────────────────────────────────────────────
// Lat/lng for Three.js globe pin placement
export const TRAVEL = [
  // California
  { name: 'Big Sur',        lat: 36.26,  lng: -121.80, country: 'USA', emoji: '🌊', note: 'PCH drive, fog at dawn, the thing itself' },
  { name: 'Santa Monica',   lat: 34.01,  lng: -118.49, country: 'USA', emoji: '🎡', note: 'Pier at golden hour, street performers' },
  { name: 'Santa Barbara',  lat: 34.42,  lng: -119.70, country: 'USA', emoji: '🌴', note: 'State Street, mission architecture' },
  { name: 'San Francisco',  lat: 37.77,  lng: -122.43, country: 'USA', emoji: '🌁', note: 'Golden Gate, Mission District, cold summers' },
  { name: 'Los Angeles',    lat: 34.05,  lng: -118.24, country: 'USA', emoji: '🎬', note: 'Griffith Observatory, DTLA, In-N-Out' },
  // Southwest
  { name: 'Las Vegas',      lat: 36.17,  lng: -115.14, country: 'USA', emoji: '🎰', note: 'The Strip, desert heat, poker tables' },
  { name: 'Sedona',         lat: 34.87,  lng: -111.79, country: 'USA', emoji: '🔴', note: 'Red rocks, vortex hikes, Cathedral Rock' },
  { name: 'Page',           lat: 36.91,  lng: -111.45, country: 'USA', emoji: '🌀', note: 'Horseshoe Bend, Antelope Canyon light beams' },
  { name: 'Flagstaff',      lat: 35.19,  lng: -111.65, country: 'USA', emoji: '🌲', note: 'Ponderosa pines, Route 66, stargazing' },
  { name: 'Tempe',          lat: 33.42,  lng: -111.94, country: 'USA', emoji: '🎓', note: 'ASU home base, desert campus life' },
  // Southeast
  { name: 'Atlanta',        lat: 33.75,  lng: -84.39,  country: 'USA', emoji: '🍑', note: 'Ponce City Market, BeltLine, Centennial Park' },
  { name: 'Savannah',       lat: 32.08,  lng: -81.10,  country: 'USA', emoji: '🌿', note: 'Spanish moss, haunted squares, River Street' },
  { name: 'Hilton Head',    lat: 32.22,  lng: -80.75,  country: 'USA', emoji: '🏖️', note: 'Atlantic beach, sea turtles, bike paths' },
];

// Travel route order (indices into TRAVEL array above)
export const TRAVEL_ROUTE = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 10, 11, 12];

// ─── Sports ─────────────────────────────────────────────────────────
export const SPORTS = {
  class: 'Full-Stack Athlete',
  tagline: 'Competes across 7 disciplines · Powered by pattern recognition',
  stats: [
    { sport: 'Cricket',       icon: '🏏', level: 88, xp: 2400, rank: 'All-rounder' },
    { sport: 'Chess',         icon: '♟️', level: 85, xp: 2200, rank: 'Tactician' },
    { sport: 'Badminton',     icon: '🏸', level: 78, xp: 1800, rank: 'Smash Specialist' },
    { sport: 'Poker',         icon: '🃏', level: 76, xp: 1700, rank: 'Calculated Risk-Taker' },
    { sport: 'Table Tennis',  icon: '🏓', level: 75, xp: 1600, rank: 'Quick Reflexes' },
    { sport: 'Volleyball',    icon: '🏐', level: 72, xp: 1400, rank: 'Team Player' },
    { sport: 'Swimming',      icon: '🏊', level: 68, xp: 1200, rank: 'Endurance Mode' },
  ],
  achievements: [
    { icon: '🏆', text: 'Multi-sport athlete across 7 disciplines' },
    { icon: '♟️', text: 'Chess rating ~1400 — top 20% globally' },
    { icon: '🧠', text: 'Poker: probabilistic thinking meets game theory' },
    { icon: '🏏', text: 'Cricket: all-rounder, batting + medium pace bowling' },
    { icon: '⚡', text: 'Pattern recognition transfers across all games' },
  ],
  philosophy: 'Every sport is a data problem.\nThe rules are the schema.\nYour opponent is the noise.\nYour training is the model.',
};