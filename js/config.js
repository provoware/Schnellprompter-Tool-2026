const query = new URLSearchParams(window.location.search);

export const config = Object.freeze({
  appName: "Schnellprompter",
  version: "0.1.0",
  environment: location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "development"
    : "production",
  debug: query.get("debug") === "1",
});
