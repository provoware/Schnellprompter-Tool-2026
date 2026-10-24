// Globale Browserfehler duerfen keine Nutzereingaben oder Fremdtexte ins Log kopieren.
export function reportRuntimeError(event, logger) {
  let code = "UNKNOWN_RUNTIME_EVENT";
  if (event?.type === "error") code = "WINDOW_ERROR";
  else if (event?.type === "unhandledrejection") code = "UNHANDLED_REJECTION";
  logger.error("Nicht behandelter Laufzeitfehler", { code });
}
