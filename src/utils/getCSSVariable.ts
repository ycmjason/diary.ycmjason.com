export const getRootCSSVariable = (s: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(s).trim();
