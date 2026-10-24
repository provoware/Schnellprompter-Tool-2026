// Globale Browserfehler duerfen keine Nutzereingaben oder Fremdtexte ins Log kopieren.
const CODES = Object.freeze({
  error: "WINDOW_ERROR",
  unhandledrejection: "UNHANDLED_REJECTION",
});

export function reportRuntimeError(event, logger) {
  const code = CODES[event?.type] ?? "UNKNOWN_RUNTIME_EVENT";
  logger.error("Nicht behandelter Laufzeitfehler", { code });
}
