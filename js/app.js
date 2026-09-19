import { config } from "./config.js";
import { createLogger } from "./logger.js";

const logger = createLogger({
  level: config.debug ? "debug" : "warn",
  context: { app: config.appName, version: config.version },
});

function start() {
  document.documentElement.dataset.appReady = "true";
  logger.debug("Anwendung initialisiert", { environment: config.environment });
}

function reportRuntimeError(event) {
  logger.error("Nicht behandelter Laufzeitfehler", {
    type: event.type,
    message: event.reason?.message ?? event.message ?? "Unbekannter Fehler",
  });
}

window.addEventListener("error", reportRuntimeError);
window.addEventListener("unhandledrejection", reportRuntimeError);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}
