# Sridhar & Gowri ? A Love Letter from Mailam

A custom wedding journal for V. Sridhar and R. Gowri, celebrating their wedding on 13 November 2026 in Mailam, Tamil Nadu.

## Run locally

```sh
npm install
npm run dev
```

Build with `npm run build`; serve the production build with `npm run preview`. Run `npm run lint` for static checks.

## The experience

- A Three.js palace entrance opens into the illustrated couple reveal.
- A portrait spread introduces the couple and both families, using their own photographs.
- A wax-sealed envelope opens on one tap, with a letter that slides out and unfolds. Use the close button to fold it away.
- A collected-photo journal shows all three original memories, preserving each photograph's composition.
- A morning-to-evening itinerary gives ceremony times, dress codes, venues and direct map links.
- An unboxed countdown leads into a photograph-led closing scene with sharing, calendar download and replay actions.

## Motion

AOS 2.3.4 handles scroll entrances. Framer Motion handles the envelope, letter unfolding, photo movement, menu transitions and countdown numbers. GSAP and React Three Fiber control the opening camera and doors. AOS and Framer transforms are applied to separate wrappers.

Reduced motion disables AOS transforms and continuous motion. Heavy 3D work has a static fallback. Photos use responsive sources and are lazy loaded outside the entrance.

## Music

`public/assets/audio1.mp3` is the user's supplied soundtrack. It loops at 40% volume. The site attempts audible autoplay immediately; when a browser blocks it, the first pointer or keyboard interaction starts the same MP3. The music button also starts playback directly. The four floating controls (wordmark, music, settings and navigation) are hidden as requested; playback continues in the background. Playback errors do not substitute another soundtrack.

Browsers control audible autoplay; a completely interaction-free start cannot be guaranteed on every device. See [Chrome's autoplay policy](https://developer.chrome.com/blog/autoplay/).

## Content

Update names, family details, event information, photo paths, map links and music in `src/config/wedding.js`. The wedding instant includes its IST offset so the countdown is consistent across visitor time zones.

- Main section components: `src/components/scenes/`
- Custom journal styling: `src/design.css`
- Entrance, envelope and shared legacy styling: `src/index.css`
- Scroll animation setup: `src/hooks/useScrollAnimations.js`
- Audio lifecycle and gesture unlock: `src/hooks/useAudio.js`

Original supplied photos are untouched. Optimized web copies live in `public/assets/`.
