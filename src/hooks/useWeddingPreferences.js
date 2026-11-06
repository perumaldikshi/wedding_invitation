import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'sridhar-gowri-wedding-preferences';

export const DEFAULT_PREFERENCES = Object.freeze({
  petalEffects: true,
  music: true,
  quality: 'medium',
});

function readPreferences() {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    // Start each visit with the requested soundtrack; browser gesture rules are handled by useAudio.
    return { ...DEFAULT_PREFERENCES, ...stored, music: true };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function useWeddingPreferences() {
  const [preferences, setPreferences] = useState(readPreferences);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // Browsing modes that disable storage still keep settings for this session.
    }
  }, [preferences]);

  const updatePreference = useCallback((key, value) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences({ ...DEFAULT_PREFERENCES });
  }, []);

  return { preferences, updatePreference, resetPreferences };
}
