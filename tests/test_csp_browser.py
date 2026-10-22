#!/usr/bin/env python3
"""Realbrowser-Test fuer CSP base-uri (isolierter HTTP-Testserver)."""
import functools
import http.server
import re
import shutil
import subprocess
import tempfile
import threading
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
html = (ROOT / "index.html").read_text(encoding="utf-8")
match = re.search(r'<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"', html, re.I)
assert match, "CSP-Meta-Tag fehlt"
browser = next((path for name in ("google-chrome", "chromium", "chromium-browser")
                if (path := shutil.which(name))), None)
assert browser, "Kein Chrome/Chromium installiert: Browsertest ist Pflicht"

with tempfile.TemporaryDirectory(prefix="provoware-csp-") as temp:
    path = Path(temp)
    (path / "index.html").write_text(
        '<!doctype html><html><head><meta charset="utf-8">'
        f'<meta http-equiv="Content-Security-Policy" content="{match.group(1)}">'
        '<base href="https://attacker.invalid/">'
        '<script src="/probe.js" defer></script></head>'
        '<body><p id="result">NICHT_AUSGEFUEHRT</p></body></html>', encoding="utf-8"
    )
    (path / "probe.js").write_text(
        'document.getElementById("result").textContent="CSP_OK:"+document.baseURI;',
        encoding="utf-8",
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
            "--no-first-run", "--virtual-time-budget=2000",
            f"--user-data-dir={path / 'chromium-profile'}",
            "--dump-dom", url,
        ], capture_output=True, text=True, timeout=30, check=False)
        server.shutdown()
        assert result.returncode == 0, f"Chromium gescheitert ({result.returncode}): {result.stderr[-1500:]}"
        assert f"CSP_OK:http://127.0.0.1:{server.server_port}/index.html" in result.stdout, (
            "CSP verhindert Base-Umleitung nicht oder Probe-Skript nicht geladen: "
            + result.stdout[-1500:]
        )
print("PASS: Reales Chromium ignoriert fremde <base>-Adresse dank CSP base-uri 'none'.")
