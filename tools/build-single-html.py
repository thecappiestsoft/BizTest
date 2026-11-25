#!/usr/bin/env python3
"""
build-single-html.py — składa całą aplikację w jeden plik dist/biztest-gen.html.

Przydaje się do wysłania aplikacji mailem lub uruchomienia bez struktury katalogów.
Wszystkie <link rel="stylesheet"> i <script src> z index.html są wklejane w kolejności,
a każdy fragment dostaje komentarz z nazwą pliku źródłowego.

Uruchomienie (z głównego katalogu projektu):
    python3 tools/build-single-html.py
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "dist" / "biztest-gen.html"


def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8")


def inline_css(match):
    rel = match.group(1)
    return f"<style>\n/* ===== {rel} ===== */\n{read(rel)}\n</style>"


def inline_js(match):
    rel = match.group(1)
    code = read(rel)
    if "</script" in code.lower():
        raise SystemExit(f"{rel}: zawiera '</script' — nie można bezpiecznie wkleić")
    return f"<script>\n/* ===== {rel} ===== */\n{code}\n</script>"


def main():
    html = read("index.html")
    html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', inline_css, html)
    html = re.sub(r'<script src="([^"]+)"></script>', inline_js, html)
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(html, encoding="utf-8")
    print(f"Zapisano {OUT.relative_to(ROOT)} ({len(html.encode('utf-8')) // 1024} KB)")


if __name__ == "__main__":
    main()
