// ============================================================
// REAL WEDDING CONFIGURATION FILE
// Sridhar & Gowri Wedding Invitation
// ============================================================

export const wedding = {
  // ── COUPLE ──────────────────────────────────────────────
  groomName: 'V. Sridhar',
  groomDegree: 'M.Sc., (CS)',
  groomOccupation: 'Shriram Finance Ltd., Tindivanam',
  groomNameTamil: 'வி. ஸ்ரீதர்',
  
  brideName: 'R. Gowri',
  brideDegree: 'B.Com.,',
  brideNameTamil: 'ஆர். கௌரி',

  groomParents: 'R. Vishvanathan – Janaki',
  groomParentsTamil: 'ஆர். விஸ்வநாதன் – ஜானகி',
  groomNative: 'Parikkalpattu, Vanur T.K.',
  groomNativeTamil: 'பரிக்கல்பட்டு, வானூர் வட்டம்',
  groomFamily: 'S/o. R. Vishvanathan – Janaki, Parikkalpattu, Vanur T.K.',

  brideParents: 'K. Rajendran – Thangam',
  brideParentsTamil: 'கே. ராஜேந்திரன் – தங்கம்',
  brideNative: 'Kavaraikadagampoondi, Gingee T.K.',
  brideNativeTamil: 'கவரைக்கடகம்பூண்டி, செஞ்சி வட்டம்',
  brideFamily: 'D/o. K. Rajendran – Thangam, Kavaraikadagampoondi, Gingee T.K.',

  compliments: 'Best Compliments from: Friends & Relatives',
  complimentsTamil: 'நல்வாழ்த்துகளுடன்: நண்பர்கள் மற்றும் உறவினர்கள்',

  // ── WEDDING DATE & TIME ──────────────────────────────────
  // 13th Friday, November 2026 (06:00 AM IST)
  weddingDate: '2026-11-13T06:00:00+05:30',
  timeZone: 'Asia/Kolkata',
  muhurthamTime: '06:00 AM – 07:30 AM IST',
  muhurthamDate: 'November 13, 2026 (Friday)',
  receptionTime: '06:30 PM Onwards',
  receptionDate: 'November 13, 2026 (Friday)',

  // ── EVENTS ───────────────────────────────────────────────
  events: [
    {
      id: 'wedding',
      title: 'Wedding Muhurtham',
      titleTamil: 'திருமண முகூர்த்தம்',
      date: 'Friday, 13th November 2026',
      time: '06:00 AM – 07:30 AM',
      venue: 'Sri Subramaniya Swamy Sannithi',
      address: 'Mailam, Tamil Nadu',
      dressCode: 'Traditional Silk Saree / Veshti & Shirt',
      icon: 'star',
      mapUrl: 'https://maps.app.goo.gl/y5sxVbKHjMR537Am8',
      enabled: true,
    },
    {
      id: 'reception',
      title: 'Wedding Reception',
      titleTamil: 'வரவேற்பு விழா',
      date: 'Friday, 13th November 2026',
      time: '06:30 PM Onwards',
      venue: 'Kasiyammal Thirumana Mandapam',
      address: 'Pondy Road, Mailam, Tamil Nadu',
      dressCode: 'Festive / Traditional Silk',
      icon: 'sparkle',
      mapUrl: 'https://maps.app.goo.gl/XTZ46jRuxzYTm3ZS8',
      enabled: true,
    },
  ],

  // ── VENUE (Ceremony & Reception) ──────────────────────────
  venueName: 'Sri Subramaniya Swamy Sannithi & Kasiyammal Thirumana Mandapam',
  venueAddress: 'Mailam (Pondy Road), Tamil Nadu',
  muhurthamMapUrl: 'https://maps.app.goo.gl/y5sxVbKHjMR537Am8',
  receptionMapUrl: 'https://maps.app.goo.gl/XTZ46jRuxzYTm3ZS8',

  // ── OUR STORY ────────────────────────────────────────────
  story: [
    {
      chapter: 'Destined Together',
      chapterTamil: 'இறைவன் அருளால்',
      year: '2026',
      text: 'With the divine blessings of Lord Murugan at Mailam and the heartfelt wishes of our parents, two souls and families unite in love.',
      image: '/assets/story-temple-1600.jpg',
      imageSrcSet: '/assets/story-temple-800.jpg 800w, /assets/story-temple-1600.jpg 1600w',
      imageAlt: 'Sridhar and Gowri together outside the temple',
      imageWidth: 1600,
      imageHeight: 2400,
    },
    {
      chapter: 'Two Families, One Heart',
      chapterTamil: 'இரு குடும்பங்கள் இணையும் விழா',
      year: '2026',
      text: 'From Parikkalpattu and Kavaraikadagampoondi, our journeys converge into a shared lifetime of happiness, tradition, and prosperity.',
      image: '/assets/story-seaside-1600.jpg',
      imageSrcSet: '/assets/story-seaside-800.jpg 800w, /assets/story-seaside-1600.jpg 1600w',
      imageAlt: 'Sridhar and Gowri smiling at each other by the sea',
      imageWidth: 1600,
      imageHeight: 1067,
    },
    {
      chapter: 'Forever Begins',
      chapterTamil: 'திருமண பந்தம்',
      year: '2026',
      text: 'We seek your gracious presence, prayers and blessings as we take our sacred seven steps into forever on this auspicious Friday.',
      image: '/assets/story-cafe-1600.jpg',
      imageSrcSet: '/assets/story-cafe-800.jpg 800w, /assets/story-cafe-1600.jpg 1600w',
      imageAlt: 'Sridhar and Gowri together at a colourful cafe',
      imageWidth: 1600,
      imageHeight: 1067,
    },
  ],

  // ── COUPLE PHOTOS ────────────────────────────────────────
  couplePhotos: {
    main: {
      image: '/assets/couple-red-door-1600.jpg',
      imageSrcSet: '/assets/couple-red-door-800.jpg 800w, /assets/couple-red-door-1600.jpg 1600w',
      imageAlt: 'Sridhar and Gowri sitting together in front of a red door',
      imageWidth: 1600,
      imageHeight: 2400,
    },
    together: {
      image: '/assets/couple-motorcycle-1600.jpg',
      imageSrcSet: '/assets/couple-motorcycle-800.jpg 800w, /assets/couple-motorcycle-1600.jpg 1600w',
      imageAlt: 'Sridhar and Gowri together on a motorcycle',
      imageWidth: 1600,
      imageHeight: 1067,
    },
    groom: null,
    bride: null,
  },

  // ── AUDIO ────────────────────────────────────────────────
  backgroundMusic: '/assets/audio1.mp3', // User-provided wedding soundtrack

  // ── THEME ────────────────────────────────────────────────
  theme: {
    primaryGold: '#D4A017',
    deepGold: '#B8860B',
    lightGold: '#FFD700',
    ivory: '#FFFFF0',
    champagne: '#F7E7CE',
    maroon: '#800020',
    emerald: '#006400',
    palaceBg: '#0A0505',
  },

  // ── SOCIAL / SHARE ───────────────────────────────────────
  shareTitle: 'Wedding Invitation: V. Sridhar ♥ R. Gowri',
  shareText: 'You are cordially invited to celebrate the wedding of V. Sridhar M.Sc., (CS) & R. Gowri B.Com., on Friday, 13th November 2026 at Mailam.',
  // Versioned so WhatsApp refreshes the link preview after metadata changes.
  shareUrl: 'https://sri-weds-gowri-wedding-invitation.vercel.app/?v=temple-photo-2',

  // ── ICS CALENDAR ─────────────────────────────────────────
  icsEvent: {
    title: 'V. Sridhar & R. Gowri Wedding',
    description: 'Wedding Muhurtham: 6:00 AM - 7:30 AM at Sri Subramaniya Swamy Sannithi, Mailam. Reception: 6:30 PM Onwards at Kasiyammal Thirumana Mandapam, Pondy Road, Mailam.',
    location: 'Sri Subramaniya Swamy Sannithi & Kasiyammal Thirumana Mandapam, Mailam, Tamil Nadu',
    startDate: '20261113T003000Z', // UTC for 06:00 AM IST on Nov 13, 2026
    endDate: '20261113T160000Z',   // Covers till evening reception completion
  },
};

export default wedding;
