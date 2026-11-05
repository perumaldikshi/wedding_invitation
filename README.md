# 🪷 Luxury Cinematic 3D Indian Wedding Invitation

A production-ready, royal South Indian 3D animated wedding invitation website built with **React**, **Three.js / React Three Fiber**, **GSAP**, **Framer Motion**, and **Tailwind CSS**. Designed mobile-first as an interactive cinematic wedding film experience with touch gestures, real 3D palace doors, realistic lighting, floating flower petals, and procedural temple soundscapes.

---

## ✨ Experience Highlights

### 🎬 8 Immersive Cinematic Scenes
1. **Cinematic Opening (Royal Palace Doors)**
   - 3D golden palace entrance with traditional Dravidian arch and pillar carvings.
   - Golden ambient particle reveal.
   - Tap door / "Tap to Open Our Invitation" button or swipe outward to swing open the 3D doors.
   - Smooth cinematic camera zoom transition gliding past the opened doors.
   - Automatic CSS fallback for non-WebGL devices and `prefers-reduced-motion` compliance.

2. **Couple Reveal**
   - 3D Mandapam background with floating petals, golden particles, and warm temple lighting.
   - Grand royal gold typography with bilingual English and Tamil name reveals.
   - Family blessing declaration and couple portrait frames.

3. **Interactive 3D Invitation Card**
   - Realistic embossed gold metallic borders with deep royal maroon velvet back face.
   - Gentle pointer/touch parallax tilt with spring physics.
   - Swipe left/right or tap to smoothly flip between cover and ceremony schedule.
   - Double-tap to reset card orientation.
   - Two-finger pinch-to-zoom with safe limits.
   - Non-blocking touch handling to preserve page scrolling.

4. **Our Story Timeline Carousel**
   - Interactive chapter cards: *"How We Met"*, *"Our Journey"*, and *"Forever Begins"*.
   - Swipe navigation with 3D depth transitions, step dots, and accessible arrows.
   - Configurable photo frames and dual-language subtitles.

5. **Wedding Events**
   - Elegant responsive cards for **Engagement**, **Mehendi**, **Wedding Muhurtham**, and **Reception**.
   - Staggered entry animations, ceremony dress codes, dates, and venue locations.
   - Easily enable or disable any event in configuration.

6. **Live Wedding Countdown**
   - Real-time countdown timer tracking Days, Hours, Minutes, and Seconds.
   - Configurable target timezone (`Asia/Kolkata` IST).
   - Dynamic celebratory greeting state once the wedding begins.

7. **3D Wedding Mandapam & Venue Exploration**
   - Interactive 3D wedding altar with Dravidian pillars, flower garlands, and glowing sacred Agni Kundam.
   - Orbit touch controls: touch drag to rotate, pinch to zoom.
   - Interactive ✦ markers for sacred wedding elements (Agni Kundam, Dravidian Pillars, Kalyana Vedika).
   - One-tap "Reset View" button.
   - Venue address and direct "Get Directions" button launching Google Maps without API keys.

8. **Final Blessings & Invitation Actions**
   - Romantic golden-hour ambient glow with floating South Indian jasmine and rose petals.
   - Native Web Share API integration with automatic clipboard fallback.
   - "Add to Calendar" button generating an `.ics` iCalendar file for Google Calendar, Apple Calendar, and Outlook.
   - Haptic vibration feedback on supported devices (`navigator.vibrate`).
   - "Replay Opening" button to restart the cinematic journey.

### 🎵 Web Audio API Background Music
- **Zero copyrighted music bundled**: Features a built-in procedural Web Audio API **Tanpura drone & temple harmonics synthesizer** (`Sa-Pa-Sa` acoustic frequency modulation).
- Supports playing a custom local MP3 file if placed in `public/audio/`.
- Strict user-gesture activation policy (never autoplays unmuted).
- Fixed floating mute/unmute and pause/play controls with animated audio waveform bars.

### 📱 Mobile-First Interactions
- **Gyroscope Parallax**: Optional DeviceOrientation perspective tilt with explicit user permission toggle.
- **Petal Trail Canvas**: Window-level passive touch listener that generates soft petal showers when tapping or dragging anywhere without blocking normal scroll physics.
- **Touch-Friendly Ergonomics**: 48px+ touch targets, iOS/Android bottom safe area insets (`env(safe-area-inset-bottom)`), and floating scene navigation pill.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + Vite 8
- **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`, `@react-spring/three`
- **Animations**: GSAP (GreenSock), Framer Motion
- **Styling**: Tailwind CSS v4, Custom Dravidian Gold & Velvet Palace Theme
- **Sound**: Web Audio API (procedural Tanpura drone synthesis) + HTML5 Audio
- **Icons & Typography**: Cormorant Garamond, Dancing Script, EB Garamond, Noto Serif Tamil

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Production Build
```bash
npm run build
```
The optimized static bundle will be built in the `dist/` directory.

### 4. Local Build Preview
```bash
npm run preview
```

---

## ⚙️ Customizing Wedding Details

All texts, dates, venue locations, maps URLs, photos, events, and audio paths are consolidated in a single file:

👉 `src/config/wedding.js`

```javascript
export const wedding = {
  groomName: 'Arjun Krishnamurthy',
  groomNameTamil: 'அர்ஜுன் கிருஷ்ணமூர்த்தி',
  brideName: 'Meenakshi Sundaram',
  brideNameTamil: 'மீனாட்சி சுந்தரம்',

  // Wedding Date (ISO 8601 string)
  weddingDate: '2027-02-14T09:00:00',
  timeZone: 'Asia/Kolkata',
  muhurthamTime: '09:00 AM – 11:30 AM IST',
  muhurthamDate: 'February 14, 2027',

  // Events List (set enabled: false to hide any unused event)
  events: [ ... ],

  // Venue & Google Maps URL
  venueName: 'Sri Kapaleeshwarar Kalyana Mandapam',
  venueAddress: '23, Mylapore, Chennai – 600004, Tamil Nadu, India',
  mapsUrl: 'https://maps.google.com/?q=Sri+Kapaleeshwarar+Temple+Mylapore+Chennai',

  // Custom photos (place files in public/images/ or leave null for elegant procedural graphics)
  couplePhotos: {
    groom: null, // e.g., '/images/groom.jpg'
    bride: null, // e.g., '/images/bride.jpg'
  },

  // Optional background music (e.g., '/audio/wedding.mp3' or leave null for Web Audio Tanpura)
  backgroundMusic: null,
};
```

---

## 🌐 Static Deployment

This project is **100% frontend only** with no backend, database, or server dependencies. It deploys out-of-the-box to any static host.

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```
*(Select Vite default settings: Build command: `npm run build`, Output directory: `dist`)*

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Deploy to GitHub Pages
1. In `vite.config.js`, set `base: '/<repository-name>/'`.
2. Run `npm run build`.
3. Push the `dist/` folder to your `gh-pages` branch.

---

## 📁 Project Architecture

```
wedding-invite/
├── public/
│   ├── favicon.svg             # 💍 Ring favicon
│   ├── images/                 # Optional couple photographs
│   └── audio/                  # Optional background music (.mp3)
├── src/
│   ├── config/
│   │   └── wedding.js          # Central wedding configuration
│   ├── hooks/
│   │   ├── useAudio.js         # Web Audio API Tanpura synth & audio controller
│   │   ├── useGyroscope.js     # Device orientation parallax sensor
│   │   ├── useReducedMotion.js # prefers-reduced-motion media query hook
│   │   ├── useTouch.js         # Swipe and pointer drag gesture detector
│   │   └── useWebGL.js         # WebGL capability detector
│   ├── utils/
│   │   ├── countdown.js        # Timezone-aware countdown calculation
│   │   ├── generateICS.js      # Calendar .ics event file exporter
│   │   └── shareInvitation.js  # Web Share API + clipboard fallback
│   ├── components/
│   │   ├── three/
│   │   │   ├── RoyalDoors.jsx      # 3D animated golden palace doors with hinges
│   │   │   ├── MandapamScene.jsx   # 3D carved Dravidian pillars, Agni & garlands
│   │   │   ├── GoldenParticles.jsx # GPU accelerated golden particle field
│   │   │   ├── VenueCanvas.jsx     # Orbit-controlled 3D venue viewer
│   │   │   └── WebGLFallback.jsx   # CSS mandala fallback for unsupported devices
│   │   ├── scenes/
│   │   │   ├── OpeningScene.jsx    # Scene 1: Palace doors & cinematic reveal
│   │   │   ├── CoupleReveal.jsx    # Scene 2: Couple announcement & mandapam
│   │   │   ├── InvitationCard.jsx  # Scene 3: 3D flip card with tilt & gestures
│   │   │   ├── OurStory.jsx        # Scene 4: Interactive journey timeline
│   │   │   ├── WeddingEvents.jsx   # Scene 5: Ceremonies, dress code & details
│   │   │   ├── Countdown.jsx       # Scene 6: Live celebration countdown
│   │   │   ├── VenueScene.jsx      # Scene 7: 3D mandapam explorer & directions
│   │   │   └── FinalInvitation.jsx # Scene 8: Blessings, share & calendar
│   │   └── ui/
│   │       ├── AudioControl.jsx    # Mute/play buttons with animated wave bars
│   │       ├── FloatingNav.jsx     # Scene progress dots & mobile menu
│   │       ├── GoldButton.jsx      # Reusable royal gold metallic button
│   │       ├── LoadingScreen.jsx   # Elegant royal progress loader
│   │       ├── OrnamentalDivider.jsx # Traditional South Indian gold divider
│   │       └── PetalCanvas.jsx     # High-performance falling jasmine/rose petals
│   ├── App.jsx                 # Main application orchestrator
│   ├── index.css               # Theme variables & typography
│   └── main.jsx                # React root mount
└── vite.config.js              # Rollup code splitting & Tailwind configuration
```

---

## ♿ Accessibility & Performance

- **Zero Flash**: Respects `prefers-reduced-motion` across both 3D camera animations and 2D UI transitions.
- **Graceful WebGL Fallback**: Smooth decorative CSS mandalas appear if WebGL is disabled or unavailable.
- **Audio Autoplay Safety**: Strictly user-initiated playback complying with modern browser media policies.
- **Touch Target Standard**: All interactive buttons meet or exceed the 48×48px mobile touch guideline.
- **Asset Efficiency**: Low-poly procedural 3D meshes and lightweight canvas particle emitters maintain 60 FPS on mid-range mobile devices.
