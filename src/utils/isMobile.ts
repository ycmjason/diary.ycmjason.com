export function isMobile(): boolean {
  if (typeof navigator !== 'undefined') {
    const userAgent = navigator.userAgent.toLowerCase();

    // Common mobile device patterns
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i;

    if (mobileRegex.test(userAgent)) {
      return true;
    }
  }

  if (typeof window !== 'undefined') {
    // Check for touch support as a fallback
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      return true;
    }

    // Consider screen width for a quick heuristic
    if (window.innerWidth <= 768) {
      return true;
    }
  }

  return false;
}
