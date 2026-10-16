# drip-site

Rules for changing the Drip website. How it's built (structure, commands, typography
mechanics, sharing, QA) is in `README.md`; read it first.

## Hard constraints

- The App Store support URL is `/` and the privacy URL is `/privacy.html`: `/` keeps the
  contact email, and the policy keeps its URL and text.
- Static HTML and CSS only: no JavaScript, no frameworks, analytics, remote fonts or other
  runtime requests to other hosts.
- Never hand-edit generated files (the pages, the policy's head, font subsets, share cards).
  Change `tools/copy.mjs` or a generator and regenerate. Typography is generated too: extend
  `hang()`, `tail()` or `autospace()` rather than patching one string.

## Design and copy

- Keep it quiet: real screenshots, no animation, glass, gradients or scroll effects. A first
  version imitating Apple keynote pages (interactive demo, scrollytelling) was rejected as
  "trying too hard to prove it has taste".
- Copy states concrete facts: no slogans, no "simply/seamlessly", no exclamation marks. The
  owner revises copy by hand; use their wording as given.
- Chinese pages call the app 点滴记账 (its zh-Hans display and store name); English pages, Drip.
- Never type spaces between Chinese and Latin text in the copy.
- Guide steps must match the app: verify them in the app's source and use the exact screen and
  setting names from its String Catalogs, in both languages.

## Before pushing

- Run the QA in `README.md` › Preview and QA. Chrome can't show New York, so changes to English
  heading type need a look in Safari or on an iPhone.
- If a regeneration changes font bytes without a copy change, find out why before committing;
  subsets are meant to be reproducible.
- Ignore rules for local symlinks take no trailing slash: a committed `tools/qa` link once broke
  the Pages upload.

## Deploying

- After pushing `main`, confirm the "pages build and deployment" run succeeded
  (`gh api repos/nervouna/drip-site/actions/runs`) before calling it live.
- If the push is rejected because GitHub committed `CNAME`, fetch and rebase; never force-push.
- Don't remove `share-square.jpg` from the top of the pages or the `itemprop` tags: WeChat and
  QQ previews depend on them (README › Sharing).

## App Store badge

- `assets/img/badge-*.svg` are Apple's "Download on the App Store" artwork, committed byte for
  byte from App Store Marketing Tools
  (`toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/{black,white}/{en-us,zh-cn}`).
  Don't edit, recolor or crop them; replace them only with new files from that source.
- Black badge on light, Apple's white variant on dark, 48px tall (Apple's onscreen minimum is
  40px), with at least a quarter of its height as clear space. It links to
  `https://apps.apple.com/app/id6819748641`.
- The English landing footer carries Apple's trademark credit, which Apple requires wherever
  the badge is used. Keep it while the badge is on the page.
- English pages only, for now. The Chinese pages keep the "Coming soon" capsule, with no
  `apple-itunes-app` meta or trademark credit, until the app can be sold in mainland China
  (it waits for an ICP filing). Then switch them the same way: download the zh-cn badges from
  the source above as `badge-zh-Hans-{black,white}.svg`, set `badge: '在App Store下载'` in place
  of `capsule` in the zh-Hans copy (its `trademarks` line is already there), and drop the
  `lang === 'en'` condition on the meta in `metadata()`.
- After the app's store screenshots are retaken, regenerate the site's.
