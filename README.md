# Drip website

Static GitHub Pages site for drip.damao.io. No client JavaScript, frameworks, analytics, remote fonts or runtime external requests.

## Structure

- `index.html`, `zh-Hans/index.html`: English and Simplified Chinese landing pages.
- `guide/index.html`, `zh-Hans/guide/index.html`: paired guides.
- `privacy.html`: existing English privacy policy, unchanged body and URL.
- `style.css`: shared responsive layout and automatic light/dark colors.
- `tools/copy.mjs`: **all landing and guide copy**. Landing wording is an owner-editable draft.
- `tools/pages.mjs`: generates the four pages and policy metadata, then regenerates heading font subsets.
- `assets/screens/{en,zh-Hans}`: original app screenshots resized to 300/600 px PNG and WebP.
- `assets/fonts`: static SemiBold Newsreader Latin and per-page Noto Serif SC heading subsets, with OFL licenses.
- `assets/img`: app icon and 1200×630 social cards, separately generated for each page.
- `tools/font-report.json`: exact Chinese heading character sets and byte sizes.
- `tools/qa/`: ignored local browser captures and report; may be a symlink to a harness artifact directory.

## Regenerate

Use Node 24+, `uv`, and a local Python interpreter. From the repository root:

```sh
sh tools/setup.sh
node tools/pages.mjs
tools/.venv/bin/python tools/images.py "$HOME/Develop/Projects/drip"
```

`setup.sh` downloads OFL font sources to ignored `tools/fonts/`, and installs pinned build dependencies into ignored `tools/.venv/`. Generated assets are checked in; Pages needs no build step. Font generation fixes weight 600 (Newsreader optical size 48), preserves `halt`, subsets to the exact CJK characters/punctuation in that page's headings, and validates the resulting cmap. Latin in Chinese headings falls through to the English serif stack. Run the page generator whenever copy changes, then regenerate social cards if headings changed.

Screenshots are read from the app repository, never written there. The icon, favicon and touch icon are reused asset outputs from the earlier landing branch, not its design. To refresh the source icon on macOS, export the app's `Drip/AppIcon.icon` using Icon Composer's `ictool` (iOS Default rendition), then replace the icon/favicons; do not manually mask corners. `tools/images.py` handles screenshots only.

## Preview and social cards

```sh
python3 -m http.server 8765
```

In another terminal, launch an isolated headless Chrome (keep the process running):

```sh
mkdir -p tools/qa
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --remote-debugging-port=9223 \
  --user-data-dir="$PWD/tools/qa/chrome-profile" \
  --no-first-run --no-default-browser-check about:blank
```

Then:

```sh
node tools/social.mjs
node tools/qa.mjs
git diff --check
```

Social cards use the page heading fonts and light background. Chrome uses the self-hosted Newsreader fallback rather than New York. QA checks five pages at 320, 375, 390, 430, 768, 1024 and 1440 px in light/dark, asserts no page overflow, verifies four full gallery phones and a partial fifth at 1440 px, exercises native disclosures, checks links/anchors and every referenced image/font (including PNG/2× fallbacks and social metadata), and rejects console errors, HTTP failures or external requests. Twenty full-page captures (390/1440 × light/dark × five pages) and measured page bytes go to `tools/qa/`. Byte counts include all page images after lazy loading, HTML, CSS and loaded fonts at DPR 1; social previews are not browser page requests.

## Guide source review

Guide instructions were checked against the app's `Drip/Settings/{TemplatesView,TemplateEditor,CategoryWidgetSettingsView,KeypadModeView,SettingsView}.swift`, `Drip/App/QuickActions.swift`, `DripWidgets/{ShortcutWidgets,DripWidgets}.swift`, and the app/widget String Catalogs (including `InfoPlist.xcstrings` for New Entry). Sync/export wording is shared with the required FAQ copy. Native Home Screen and Lock Screen directions use iOS UI labels; these system screens are outside the app source.

The policy has no translated counterpart, so it has a canonical URL but no invented Chinese hreflang alternate. The four bilingual pages have en/zh-Hans/x-default alternates.
