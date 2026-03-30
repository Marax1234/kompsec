#!/usr/bin/env python3
"""Exportiert die Reveal.js-Präsentation als PDF via decktape."""

import subprocess
import sys
import time
import urllib.request
from pathlib import Path

PORT = 5174
URL = f"http://localhost:{PORT}"
OUTPUT = "collins-presentation.pdf"


def wait_for_server(timeout=15):
    for _ in range(timeout * 2):
        try:
            urllib.request.urlopen(URL, timeout=1)
            return True
        except Exception:
            time.sleep(0.5)
    return False


def main():
    root = Path(__file__).parent

    print("▶ Starte Vite-Dev-Server ...")
    server = subprocess.Popen(
        ["npx", "vite", "--port", str(PORT)],
        cwd=root,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    try:
        if not wait_for_server():
            print("✗ Server nicht erreichbar. Abbruch.")
            sys.exit(1)
        print(f"✓ Server läuft auf {URL}")

        print("▶ Exportiere PDF ...")
        result = subprocess.run(
            [
                "npx", "decktape", "reveal",
                "--size", "1280x720",
                "--pause", "1500",
                "--load-pause", "3000",
                URL,
                OUTPUT,
            ],
            cwd=root,
        )

        if result.returncode == 0:
            size_kb = (root / OUTPUT).stat().st_size // 1024
            print(f"✓ PDF erstellt: {OUTPUT} ({size_kb} KB)")
        else:
            print("✗ decktape fehlgeschlagen.")
            sys.exit(1)

    finally:
        print("▶ Räume auf ...")
        server.terminate()
        server.wait()
        print("✓ Fertig.")


if __name__ == "__main__":
    main()
