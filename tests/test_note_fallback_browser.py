#!/usr/bin/env python3
"""Browser-Smoke: fehlende Ordner-API aktiviert Download ohne Eingabeverlust."""
import functools
import http.server
import re
import shutil
import subprocess
import tempfile
import threading
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
browser = next((path for name in ("google-chrome", "chromium", "chromium-browser")
                if (path := shutil.which(name))), None)
assert browser, "Chromium fehlt: Browser-Smoke ist Pflicht"

with tempfile.TemporaryDirectory(prefix="provoware-fallback-") as temp:
    path = Path(temp)
    for folder in ("js", "css"):
        (path / folder).symlink_to(ROOT / folder, target_is_directory=True)

    html = (ROOT / "index.html").read_text(encoding="utf-8")
    assert "</head>" in html, "HTML-Kopf fehlt"
    html = html.replace("</head>", '<script src="fallback-probe.js"></script></head>', 1)
    (path / "index.html").write_text(html, encoding="utf-8")
    (path / "fallback-probe.js").write_text(
        """
        Object.defineProperty(window, "showDirectoryPicker",
          { configurable: true, value: undefined });
        window.addEventListener("DOMContentLoaded", () => {
          setTimeout(() => {
            const input = document.querySelector("#quick-note-input");
            const button = document.querySelector('#quick-note-form button[type="submit"]');
            const originalClick = HTMLAnchorElement.prototype.click;
            HTMLAnchorElement.prototype.click = function () {
              if (!this.download) return originalClick.call(this);
              document.body.dataset.downloadName = this.download;
              document.body.dataset.downloadUrl = this.href.startsWith("blob:") ? "blob" : "other";
            };
            input.value = "Browser Testnotiz";
            button.click();
            setTimeout(() => {
              document.body.dataset.fallbackInput = input.value;
              document.body.dataset.fallbackButton = button.textContent.trim();
              document.body.dataset.fallbackStatus =
                document.querySelector("#quick-note-status").textContent;
            }, 50);
          }, 100);
        });
        """, encoding="utf-8"
    )

    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *_args):
            pass

    handler = functools.partial(Quiet, directory=str(path))
    with http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler) as server:
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        url = f"http://127.0.0.1:{server.server_port}/index.html"
        result = subprocess.run([
            browser, "--headless=new", "--no-sandbox", "--disable-gpu",
            "--disable-dev-shm-usage", "--disable-background-networking",
            "--no-first-run", "--virtual-time-budget=3000",
            f"--user-data-dir={path / 'chromium-profile'}",
            "--dump-dom", url,
        ], capture_output=True, text=True, timeout=35, check=False)
        server.shutdown()
        assert result.returncode == 0, (
            f"Chromium fehlgeschlagen: {result.stderr[-1000:]}"
        )
        dom = result.stdout
        assert 'data-download-url="blob"' in dom, "Kein Blob-Download vorbereitet"
        assert re.search(
            r'data-download-name="entwicklerinfo_und_ideen_menge-inhalt-[^"]+\\.md"', dom
        ), "Dateiname fehlt"
        assert 'data-fallback-button="Herunterladen"' in dom, "Fallback-Schaltfläche fehlt"
        assert 'data-fallback-input="Browser Testnotiz"' in dom, "Notiz wurde gelöscht"
        assert "Download gestartet" in dom, "Statusmeldung fehlt"

print("PASS: Chromium-Fallback bereitet Markdown-Download vor und erhält die Eingabe.")
