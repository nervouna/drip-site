// Generate social cards with the same self-hosted heading fonts as the pages.
import fs from 'node:fs';
import { copy } from './copy.mjs';
import { connect, wait } from './cdp.mjs';
const browser = await connect();
await browser.call('Page.enable');
await browser.call('Emulation.setDeviceMetricsOverride', {width:1200,height:630,deviceScaleFactor:1,mobile:false});
await browser.call('Emulation.setEmulatedMedia', {features:[{name:'prefers-color-scheme',value:'light'}]});
for (const [lang,c] of Object.entries(copy)) {
  for (const kind of ['landing','guide',...(lang === 'en' ? ['privacy'] : [])]) {
    const title = kind === 'landing' ? c.h1 : kind === 'guide' ? c.guideTitle : 'Privacy Policy';
    await browser.call('Page.navigate',{url:`http://127.0.0.1:8765/${lang === 'en' ? '' : 'zh-Hans/'}${kind === 'guide' ? 'guide/' : ''}`});
    await wait(200);
    await browser.evaluate(`document.body.innerHTML = ${JSON.stringify(`<main style="width:1200px;height:630px;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:60px 130px;text-align:center;gap:36px"><img src="/assets/img/icon@2x.png" width="112" height="112" alt=""><h1 style="font-size:56px;margin:0">${title.replace(/([。！？]|[.!?])$/, m => `<span class="hang-${/[。！？]/.test(m) ? 'cjk' : 'latin'}">${m}</span>`)}</h1></main>`)}; document.fonts.ready`);
    await browser.evaluate('Promise.all([...document.images].map(i=>i.decode()))');
    const image = await browser.call('Page.captureScreenshot',{format:'png'});
    fs.writeFileSync(`assets/img/og-${lang}-${kind}.png`,Buffer.from(image.data,'base64'));
  }
}
browser.close();
