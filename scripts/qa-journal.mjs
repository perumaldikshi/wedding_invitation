import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const allowed = process.argv.includes('--autoplay-allowed');
const port = allowed ? 9230 : 9229;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const waitFor = async (test, label, max = 100) => { for (let i = 0; i < max; i++) { if (await test()) return; await delay(100); } throw new Error('Timed out: ' + label); };
let socket;
try {
  let pages;
  await waitFor(async () => { try { pages = await (await fetch('http://127.0.0.1:' + port + '/json')).json(); return pages.some(page => page.type === 'page'); } catch { return false; } }, 'browser');
  socket = new WebSocket(pages.find(page => page.type === 'page').webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
  let id = 0;
  const pending = new Map(), errors = [];
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
    if (pending.has(message.id)) {
      const callback = pending.get(message.id); pending.delete(message.id);
      message.error ? callback.reject(new Error(JSON.stringify(message.error))) : callback.resolve(message.result);
    }
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => { const key = ++id; pending.set(key, { resolve, reject }); socket.send(JSON.stringify({ id: key, method, params })); });
  const evaluate = async expression => { const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (result.exceptionDetails) throw new Error(result.exceptionDetails.text); return result.result.value; };
  const tap = async selector => {
    await evaluate('document.querySelector(' + JSON.stringify(selector) + ').scrollIntoView({behavior:"instant",block:"center"})');
    await delay(100);
    const point = await evaluate('(()=>{const r=document.querySelector(' + JSON.stringify(selector) + ').getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()');
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button: 'left', clickCount: 1 });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button: 'left', clickCount: 1 });
  };
  const capture = async (width, section) => {
    const clip = await evaluate('(()=>{const r=document.getElementById(' + JSON.stringify(section) + ').getBoundingClientRect();return{x:0,y:r.y+scrollY,width:innerWidth,height:r.height,scale:1}})()');
    const screenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip });
    fs.writeFileSync(path.join(os.tmpdir(), 'journal-' + width + '-' + section + '.png'), Buffer.from(screenshot.data, 'base64'));
  };
  await send('Page.enable'); await send('Runtime.enable'); await send('Page.bringToFront');
  await send('Emulation.setFocusEmulationEnabled', { enabled: true });
  await send('Emulation.setTimezoneOverride', { timezoneId: 'Asia/Kolkata' });
  for (const width of allowed ? [1440] : [320, 390, 768, 1440]) {
    const reduced = width === 320;
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: reduced ? 'reduce' : 'no-preference' }] });
    await send('Emulation.setDeviceMetricsOverride', { width, height: width > 1000 ? 1000 : 844, deviceScaleFactor: 1, mobile: width < 700 });
    await send('Page.navigate', { url: 'http://127.0.0.1:4173/?qa' });
    await waitFor(() => evaluate('Boolean(document.querySelector("#final .finale-actions") && document.querySelector("audio[data-wedding-audio]"))'), 'all sections');
    await waitFor(() => evaluate('document.querySelector("audio[data-wedding-audio]").readyState >= 2'), 'MP3 decode');
    const firstAudio = await evaluate('(()=>{const a=document.querySelector("audio[data-wedding-audio]");return{source:a.currentSrc,paused:a.paused,loop:a.loop,volume:a.volume,count:document.querySelectorAll("audio[data-wedding-audio]").length,error:a.error?.code||null}})()');
    if (!firstAudio.source.endsWith('/assets/audio1.mp3') || firstAudio.count !== 1 || !firstAudio.loop || firstAudio.error) throw new Error('Audio source/lifecycle: ' + JSON.stringify(firstAudio));
    if (allowed) {
      await waitFor(() => evaluate('!document.querySelector("audio[data-wedding-audio]").paused && document.querySelector("audio[data-wedding-audio]").currentTime > 0.1'), 'allowed autoplay');
      console.log(JSON.stringify({ autoplayAllowed: true, ...firstAudio }));
      continue;
    }
    if (width === 320) {
      if (!firstAudio.paused) throw new Error('Strict-policy autoplay should require interaction');
      await tap('.journal-couple-copy .journal-intro');
      await waitFor(() => evaluate('!document.querySelector("audio[data-wedding-audio]").paused && document.querySelector("audio[data-wedding-audio]").currentTime > 0.1'), 'first-gesture audio unlock');
      await evaluate('document.querySelector("audio[data-wedding-audio]").pause()');
      await tap('.journal-couple-copy .journal-intro');
      if (!await evaluate('document.querySelector("audio[data-wedding-audio]").paused')) throw new Error('Explicit pause resumed on later tap');
    }
    const sections = ['opening', 'couple', 'invitation', 'story', 'events', 'countdown', 'final'];
    for (const section of sections) {
      await evaluate('document.getElementById(' + JSON.stringify(section) + ').scrollIntoView({behavior:"instant",block:"start"})');
      const count = await evaluate('document.querySelectorAll("#' + section + ' [data-aos]").length');
      for (let i = 0; i < count; i++) {
        await evaluate('document.querySelectorAll("#' + section + ' [data-aos]")[' + i + '].scrollIntoView({behavior:"instant",block:"center"})');
        await delay(60);
      }
      await delay(reduced ? 40 : 900);
      await evaluate('document.getElementById(' + JSON.stringify(section) + ').scrollIntoView({behavior:"instant",block:"start"})');
      await delay(100);
      if (width === 390 || width === 1440) await capture(width, section);
    }
    await waitFor(() => evaluate('[...document.querySelectorAll(".memory-print img")].every(img=>img.complete && img.naturalWidth>0)'), 'three photos');
    const layout = await evaluate('(()=>{const controls=[".site-wordmark",".soundtrack-control",".journey-menu",".experience-settings"];const aos=[...document.querySelectorAll("[data-aos]")];return{sections:document.querySelectorAll("main > section").length,photos:document.querySelectorAll(".memory-print img").length,controlsHidden:controls.every(s=>getComputedStyle(document.querySelector(s)).display==="none"),aosCount:aos.length,aosVisible:aos.every(e=>getComputedStyle(e).opacity==="1"),overflow:document.documentElement.scrollWidth>innerWidth,contentFits:[...document.querySelectorAll(".journal-people > div,.itinerary-details,.memory-entry,.forever-clock")].every(e=>e.scrollWidth<=e.clientWidth+2)}})()');
    if (!layout.controlsHidden || layout.photos !== 3 || layout.aosCount < 20 || !layout.aosVisible || layout.overflow || !layout.contentFits || layout.sections !== 7) throw new Error('Layout: ' + JSON.stringify({ width, ...layout }));
    await tap('.envelope-open-button');
    await delay(reduced ? 200 : 2300);
    if (!await evaluate('Boolean(document.querySelector(".invitation-letter") && document.querySelectorAll(".letter-event").length===2 && document.querySelector(".letter-unfolded-details").clientHeight>=document.querySelector(".letter-unfolded-details").scrollHeight-1)')) throw new Error('Letter did not unfold fully');
    await tap('.letter-close-button'); await delay(300);
    if (await evaluate('Boolean(document.querySelector(".invitation-letter"))')) throw new Error('Letter did not close');
    await evaluate('Object.defineProperty(navigator,"share",{value:undefined,configurable:true});Object.defineProperty(navigator,"clipboard",{value:{writeText:async value=>{window.__copiedInvitation=value}},configurable:true});document.querySelector(".finale-actions button").click()');
    await waitFor(() => evaluate('Boolean(window.__copiedInvitation)'), 'share fallback');
    await evaluate('window.__originalCreate=URL.createObjectURL;URL.createObjectURL=blob=>{window.__calendarText=blob.text();return window.__originalCreate(blob)};window.__originalAnchor=HTMLAnchorElement.prototype.click;HTMLAnchorElement.prototype.click=function(){if(!this.download)window.__originalAnchor.call(this)};document.querySelectorAll(".finale-actions button")[1].click()');
    const calendar = await evaluate('window.__calendarText');
    if (!calendar.includes('DTSTART:20261113T003000Z') || !calendar.includes('BEGIN:VEVENT')) throw new Error('Calendar contents incorrect');
    console.log(JSON.stringify({ width, reducedMotion: reduced, ...layout, letterWorks: true, shareWorks: true, calendarWorks: true, firstGestureAudio: width === 320 ? 'passed' : 'covered' }));
  }
  if (errors.length) throw new Error('Runtime errors: ' + JSON.stringify(errors));
  console.log(JSON.stringify({ runtimeErrors: errors, result: 'PASS' }));
  socket.close();
} catch (error) { console.error(error); socket?.close(); process.exitCode = 1; }
