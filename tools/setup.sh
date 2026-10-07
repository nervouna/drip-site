#!/bin/sh
set -eu
# Run from the repository root. Build-time downloads only; the website is self-hosted.
uv venv tools/.venv
uv pip install --python tools/.venv/bin/python -r tools/requirements.txt
mkdir -p tools/fonts
curl -L --fail 'https://raw.githubusercontent.com/google/fonts/main/ofl/notoserifsc/NotoSerifSC%5Bwght%5D.ttf' -o tools/fonts/NotoSerifSC.ttf
curl -L --fail 'https://raw.githubusercontent.com/google/fonts/main/ofl/newsreader/Newsreader%5Bopsz%2Cwght%5D.ttf' -o tools/fonts/Newsreader.ttf
