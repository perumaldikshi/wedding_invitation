export async function shareInvitation({ title, text, url }) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return { success: true, method: 'native' };
    } catch (err) {
      if (err.name !== 'AbortError') {
        return fallbackCopy(url);
      }
      return { success: false, method: 'cancelled' };
    }
  }
  return fallbackCopy(url);
}

async function fallbackCopy(url) {
  try {
    await navigator.clipboard.writeText(url);
    return { success: true, method: 'clipboard' };
  } catch {
    return { success: false, method: 'failed' };
  }
}
