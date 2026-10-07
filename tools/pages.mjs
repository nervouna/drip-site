import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copy, languages, screens, featureScreens, guideIds, guideScreens } from './copy.mjs';
const esc = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const origin = 'https://drip.damao.io';
// Plain-text contexts (tab title, share previews) get no CSS text-autospace, so add the
// CJK–Latin spaces here instead of writing them into the copy.
const autospace = s => s.replace(/([\u4e00-\u9fff])([A-Za-z0-9])/g, '$1 $2').replace(/([A-Za-z0-9])([\u4e00-\u9fff])/g, '$1 $2');
// Centered text ending in punctuation: wrap the final mark so a negative end margin takes its
// width out of the last line; the words, not the words plus the mark, sit on the center line
// (see .hang-* in style.css). Only the line holding the mark moves.
const hang = text => text.replace(/([。！？]|[.!?])$/, m => `<span class="hang-${/[。！？]/.test(m) ? 'cjk' : 'latin'}">${m}</span>`);
// Chinese paragraphs: keep the last two characters (or the last Latin word) together with the
// closing punctuation, so a paragraph never ends with one character alone on its line. ICU's
// Chinese word segmentation is too coarse to find real word boundaries, hence two characters.
// `withHang` also applies the optical-centering wrap to the final mark.
const tail = (text, withHang = false) => {
  const m = text.match(/([\u4e00-\u9fff]{2}|[A-Za-z0-9]+)([。！？）」』”]+)$/);
  if (!m) return withHang ? hang(text) : text;
  const mark = withHang ? hang(m[2]) : m[2];
  return `${text.slice(0, m.index)}<span class="keep">${m[1]}${mark}</span>`;
};
export function metadata(lang, title, description, path, kind = 'landing') {
  title = autospace(title);
  description = autospace(description);
  const pair = kind === 'guide' ? 'guide/' : '';
  const og = `/assets/img/og-${lang}-${kind}.png`;
  return `<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}">
<link rel="canonical" href="${origin}${path}">
${kind === 'privacy' ? '' : `<link rel="alternate" hreflang="en" href="${origin}/${pair}"><link rel="alternate" hreflang="zh-Hans" href="${origin}/zh-Hans/${pair}"><link rel="alternate" hreflang="x-default" href="${origin}/${pair}">`}
<meta property="og:type" content="website"><meta property="og:site_name" content="${lang === 'en' ? 'Drip' : '点滴记账'}"><meta property="og:locale" content="${lang === 'en' ? 'en_US' : 'zh_CN'}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${origin}${path}"><meta property="og:image" content="${origin}${og}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(title)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${origin}${og}">
<meta name="theme-color" content="#F7F7F5" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#141414" media="(prefers-color-scheme: dark)">
<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="stylesheet" href="/style.css?v=${version('style.css')}">
${lang === 'zh-Hans' ? `<link rel="stylesheet" href="/assets/fonts/zh-${kind}.css?v=${version(`assets/fonts/zh-${kind}.css`)}">` : ''}`;
}
function picture(lang, screen, alt, eager = false) {
  const base = `/assets/screens/${lang}/${screen}`;
  return `<picture><source type="image/webp" srcset="${base}@1x.webp 1x, ${base}@2x.webp 2x"><img class="phone" src="${base}@1x.png" srcset="${base}@1x.png 1x, ${base}@2x.png 2x" width="300" height="652" alt="${esc(alt)}" loading="${eager ? 'eager' : 'lazy'}" decoding="async"></picture>`;
}
const icon = size => `<img src="/assets/img/icon@2x.png" width="${size}" height="${size}" alt="">`;
const zh = copy['zh-Hans'];
fs.writeFileSync('tools/headings.json', JSON.stringify({'zh-landing': [zh.brand,zh.h1,...zh.features.map(x=>x[0]),zh.support].join(''), 'zh-guide':[zh.brand,zh.guideTitle,...zh.items.map(x=>x[0])].join('')}));
execFileSync('tools/.venv/bin/python', ['tools/fonts.py','tools/headings.json'], {stdio:'inherit'});
// GitHub Pages caches assets for 10 minutes, so stylesheet and font URLs carry a content hash:
// after a copy change, browsers fetch the new subsets right away instead of mixing in stale ones.
const version = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 10);
const stamp = (file, asset) => fs.writeFileSync(file, fs.readFileSync(file, 'utf8')
  .replace(new RegExp(`(/assets/fonts/${asset})(\\?v=[0-9a-f]+)?`, 'g'), `$1?v=${version(`assets/fonts/${asset}`)}`));
for (const page of ['zh-landing', 'zh-guide']) stamp(`assets/fonts/${page}.css`, `${page}.woff2`);
stamp('style.css', 'newsreader-latin.woff2');
for (const [lang, c] of Object.entries(copy)) {
  const root = lang === 'en' ? '/' : '/zh-Hans/';
  const other = lang === 'en' ? '/zh-Hans/' : '/';
  for (const guide of [false, true]) {
    const kind = guide ? 'guide' : 'landing';
    const path = root + (guide ? 'guide/' : '');
    const title = guide ? `${c.guideTitle} – ${c.brand}` : c.title;
    const nav = `<nav class="nav container"><a class="brand" href="${root}">${icon(32)}${c.brand}</a><a class="nav-secondary" href="${root}guide/">${c.guide}</a><a class="nav-secondary" href="${guide ? root : ''}#support">${c.support}</a><a href="${other}${guide ? 'guide/' : ''}" lang="${lang === 'en' ? 'zh-Hans' : 'en'}">${c.language}</a></nav>`;
    const footer = `<footer class="footer container"><p><a href="${root}guide/">${c.guide}</a> · <a href="/privacy.html">${c.privacy}</a> · ${c.copyright}</p><a href="${other}${guide ? 'guide/' : ''}" lang="${lang === 'en' ? 'zh-Hans' : 'en'}">${c.language}</a></footer>`;
    const capsule = `<p class="capsule">${c.capsule}</p>`;
    const content = guide
      ? `<main class="guide"><h1>${c.guideTitle}</h1><ul class="toc">${c.items.map(([h], i) => `<li><a href="#${guideIds[i]}">${h}</a></li>`).join('')}</ul>${c.items.map(([h, body], i) => `<section id="${guideIds[i]}"><h2>${h}</h2><p>${tail(esc(body))}</p>${guideScreens[i] ? picture(lang, guideScreens[i], h) : ''}</section>`).join('')}</main>`
      : `<main><section class="hero"><h1>${hang(c.h1)}</h1><p class="sub">${tail(c.sub, true)}</p>${capsule}</section>
<div class="gallery" tabindex="0">${screens.map((screen, i) => `<figure>${picture(lang, screen, c.captions[i], true)}<figcaption>${c.captions[i]}</figcaption></figure>`).join('')}</div>
<div class="features container">${c.features.map(([h, body], i) => `<section class="feature"><div class="feature-copy"><h2>${h}</h2><p>${tail(esc(body))}</p>${i === 0 ? `<a href="${root}guide/#app-icon">${c.setup}</a>` : ''}</div>${picture(lang, featureScreens[i], h)}</section>`).join('')}</div>
<section class="closing">${icon(96)}${capsule}<p>${tail(c.free, true)}</p><p class="languages">${languages}</p></section>
<section class="support" id="support"><h2>${c.support}</h2><p>${tail(c.contact).replace('xiaoyuguan@hotmail.com', '<a href="mailto:xiaoyuguan@hotmail.com">xiaoyuguan@hotmail.com</a>')}</p><div class="faq">${c.faq.map(([q,a]) => `<details><summary>${q}</summary><p>${tail(esc(a))}</p></details>`).join('')}</div><a href="${root}guide/">${c.more}</a></section></main>`;
    const file = `.${path}index.html`;
    fs.mkdirSync(`.${path}`, {recursive:true});
    fs.writeFileSync(file, `<!doctype html>\n<html lang="${lang}"><head>${metadata(lang,title,guide ? c.guideDescription : c.sub,path,kind)}</head><body>${nav}${content}${footer}</body></html>\n`);
  }
}
// Preserve the policy's body verbatim; only its head is regenerated.
const policy = fs.readFileSync('privacy.html','utf8');
fs.writeFileSync('privacy.html', policy.replace(/<head>[\s\S]*?<\/head>/, `<head>${metadata('en','Privacy Policy – Drip',"Drip doesn't collect any data.",'/privacy.html','privacy')}</head>`));
