/** Mode navigation légère en dev (évite gel OneDrive + canvas + overlays). */
export const isDevNavLite =
  typeof import.meta !== "undefined" &&
  import.meta.env?.DEV === true &&
  import.meta.env?.VITE_NAV_HEAVY !== "1";
