// Browser-boundary acceptance: broken assets, responsive clipping, gallery geometry,
// native disclosures and rendering. No production test seams or runtime scripts.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { connect, wait } from './cdp.mjs';
const browser = await connect();
const origin = 'http://127.0.0.1:8765';
const out = 'tools/qa';
fs.mkdirSync(out,{recursive:true});
const errors=[], failures=[], external=new Set(), report=[];
browser.on('Runtime.exceptionThrown', e=>errors.push(e.exceptionDetails.text));
browser.on('Runtime.consoleAPICalled', e=>{if(e.type==='error')errors.push(JSON.stringify(e.args));});
browser.on('Network.responseReceived', e=>{if(e.response.status>=400)failures.push(e.response.url);if(!e.response.url.startsWith(origin))external.add(e.response.url);});
await browser.call('Page.enable');await browser.call('Runtime.enable');await browser.call('Network.enable');
await browser.call('Network.setCacheDisabled',{cacheDisabled:true});
for(const path of ['/','/zh-Hans/','/guide/','/zh-Hans/guide/','/privacy.html']) {
  for(const theme of ['light','dark']) for(const width of [320,375,390,430,768,1024,1440]) {
    await browser.call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
    await browser.call('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:theme}]});
    await browser.call('Page.navigate',{url:origin+path});await wait(180);
    await browser.evaluate('document.fonts.ready');
    await browser.evaluate('Promise.all([...document.images].map(i=>{i.loading="eager";return i.decode()}))');
    assert.equal(await browser.evaluate('document.documentElement.scrollWidth > innerWidth'),false,`${path} ${width} ${theme} overflow`);
    if(width===1440 && (path==='/'||path==='/zh-Hans/')) {
      const bounds=await browser.evaluate('[...document.querySelectorAll(".gallery figure")].map(e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right}})');
      assert.equal(bounds.filter(r=>r.left>=0&&r.right<=1440).length,4);
      assert.ok(bounds[4].left<1440&&bounds[4].right>1440,'Fifth phone peeks');
    }
    if(width===390||width===1440) {
      const height=await browser.evaluate('document.documentElement.scrollHeight');
      const image=await browser.call('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width,height,scale:1}});
      const file=`${path==='/'?'en':path.replaceAll('/','-').replace(/^-|-$/g,'')}-${width}-${theme}.png`;
      fs.writeFileSync(`${out}/${file}`,Buffer.from(image.data,'base64'));
      const bytes=await browser.evaluate('performance.getEntriesByType("resource").reduce((s,r)=>s+r.encodedBodySize,0)+performance.getEntriesByType("navigation")[0].encodedBodySize');
      report.push({path,width,theme,bytes,screenshot:file});
    }
  }
  const urls=await browser.evaluate(`Array.from(new Set([...document.querySelectorAll('[src],[srcset],link[href],a[href],meta[property="og:image"],meta[name="twitter:image"]')].flatMap(e=>[e.getAttribute('src'),e.getAttribute('href'),e.getAttribute('content'),...(e.getAttribute('srcset')||'').split(',').map(s=>s.trim().split(' ')[0])]).filter(Boolean)))`);
  for(const url of urls) {
    if(url.startsWith('mailto:'))continue;
    const local=new URL(url.replace('https://drip.damao.io',origin),origin+path);
    const response=await fetch(local);assert.equal(response.status,200,local.href);
    const body=await response.text();
    if(local.hash&&response.headers.get('content-type')?.includes('text/html'))assert.ok(body.includes(`id="${local.hash.slice(1)}"`),`Missing anchor ${local}`);
  }
  if(path==='/'||path==='/zh-Hans/') {
    await browser.evaluate('document.querySelector("summary").click()');
    assert.equal(await browser.evaluate('document.querySelector("details").open'),true);
  }
}
// Explicitly fetch every CSS font URL too (including fallback faces unused on macOS).
for(const file of ['style.css','assets/fonts/zh-landing.css','assets/fonts/zh-guide.css']) {
  const text=fs.readFileSync(file,'utf8');
  for(const [,url] of text.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g)) { const response=await fetch(origin+url); assert.equal(response.status,200,url); await response.arrayBuffer(); }
}
assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);assert.deepEqual([...external],[]);
fs.writeFileSync(`${out}/report.json`,JSON.stringify({errors,failures,external:[...external],report},null,2));
browser.close();
console.log('PASS: 70 page/viewport/theme checks; 20 screenshots; gallery geometry; disclosures; all links/assets; no errors, 404s or external requests.');
