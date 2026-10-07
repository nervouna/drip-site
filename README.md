# Drip website

Static GitHub Pages site for [drip.damao.io](https://drip.damao.io), the website of the Drip
iPhone app (中文名「点滴记账」). This file describes how the site is built; the rules for
changing it are in `CLAUDE.md`.

## Structure

- `index.html`, `zh-Hans/index.html`: English and Simplified Chinese landing pages, with the
  support contact and FAQ at the bottom.
- `guide/index.html`, `zh-Hans/guide/index.html`: paired guides.
- `privacy.html`: English privacy policy. Its body is maintained by hand; `pages.mjs`
  regenerates only its `<head>`.
- `style.css`: shared layout, typography and light/dark colors.
- `tools/copy.mjs`: all landing and guide copy.
- `tools/pages.mjs`: generates the four pages and the policy's head, the heading font subsets,
  and the versioned asset URLs.
- `tools/social.mjs`: renders the 1200×630 share card for each page.
- `tools/images.py`: resizes the app's screenshots into `assets/screens/{en,zh-Hans}` (300/600 px,
  PNG and WebP). Reads the app repository, never writes to it.
- `tools/fonts.py`: builds the heading font subsets into `assets/fonts` (with OFL licenses);
  `tools/font-report.json` lists each subset's characters and size.
- `tools/qa.mjs`, `tools/cdp.mjs`: browser checks over the Chrome DevTools protocol.
- `assets/img`: app icon, share cards, and `share-square.jpg` (see Sharing).
- `tools/qa/`, `tools/.venv/`, `tools/fonts/`: local, ignored.

## Build

Needs Node 24+ and `uv`. From the repository root:

```sh
sh tools/setup.sh   # once: pinned Python deps in tools/.venv, OFL font sources in tools/fonts
node tools/pages.mjs
tools/.venv/bin/python tools/images.py "$HOME/Develop/Projects/drip"   # after new screenshots
```

Generated files are committed; Pages has no build step.

The app icon assets come from the app's `Drip/AppIcon.icon`, exported with Icon Composer's
`ictool` (iOS Default rendition; the command is in the app repo's `.claude/skills/app-icon`
skill) and converted to 8-bit. Don't mask the corners by hand.

## Typography

- Headings use New York through `ui-serif` (Apple platforms only) with a self-hosted Newsreader
  SemiBold (opsz 48) Latin fallback.
- Chinese headings use Noto Serif SC SemiBold, subset per page to exactly the characters in that
  page's headings and brand. The subset is declared as "Drip Serif SC" with a CJK-only
  `unicode-range` and comes first in the Chinese heading stack, so Latin words in Chinese
  headings still use the English serif. Subsets keep `halt` (half-width punctuation), are
  validated against the expected character set, and are byte-reproducible.
- `text-autospace` spaces Chinese and Latin text; `autospace()` in `pages.mjs` adds real spaces
  where CSS doesn't apply (title, meta, share text).
- `hang()` wraps the final mark of centered text in `.hang-latin`/`.hang-cjk`, whose negative end
  margin keeps the words on the center line.
- `tail()` wraps the last two characters (or last Latin word) of a Chinese paragraph with its
  closing mark in `.keep` (`text-wrap: nowrap`). English paragraphs use `text-wrap: pretty`,
  headings `text-wrap: balance`.
- `style.css`, the font CSS files and the WOFF2 files are referenced with `?v=<content hash>`,
  because Pages lets browsers cache assets for 10 minutes.

## Sharing

Each page has Open Graph and Twitter tags and its own share card. WeChat ignores these unless
the page uses its JS-SDK, which needs an official account and an ICP-filed domain; it takes the
title from `<title>` and the thumbnail from the first body image of at least 300px. That is
`share-square.jpg` (400px), the first element of every page, loaded but visually hidden. QQ
reads the `itemprop` tags in the head. WeChat caches previews: test with a new query string,
sharing from WeChat's own browser.

The policy has no translation, so it has a canonical URL but no hreflang alternates; the four
bilingual pages have en, zh-Hans and x-default alternates.

## Preview and QA

```sh
python3 -m http.server 8765
```

In another terminal, start an isolated headless Chrome and keep it running:

```sh
mkdir -p tools/qa
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --remote-debugging-port=9223 \
  --user-data-dir="$PWD/tools/qa/chrome-profile" \
  --no-first-run --no-default-browser-check about:blank
```

Then:

```sh
node tools/social.mjs   # when a heading or brand on a card changes
node tools/qa.mjs
git diff --check
```

`qa.mjs` checks the five pages at 320, 375, 390, 430, 768, 1024 and 1440 px in light and dark:
no page overflow, four full gallery phones and part of a fifth at 1440 px, working disclosures,
every link, anchor, image and font (including PNG/2× fallbacks and share metadata), and no
console errors, HTTP failures or external requests. It saves 20 full-page captures and page
weights to `tools/qa/`. Chrome has no New York, so it renders the Newsreader fallback.

## Deploy

Pushing `main` deploys through GitHub Pages ("pages build and deployment" in Actions). The
custom domain is set in the repository's Pages settings, which commits `CNAME` itself.

## Guide sources

The guide's steps were checked against the app's
`Drip/Settings/{TemplatesView,TemplateEditor,CategoryWidgetSettingsView,KeypadModeView,SettingsView}.swift`,
`Drip/App/QuickActions.swift`, `DripWidgets/{ShortcutWidgets,DripWidgets}.swift` and the String
Catalogs (including `InfoPlist.xcstrings`). Home Screen and Lock Screen steps use iOS's own
labels; those screens are outside the app.
