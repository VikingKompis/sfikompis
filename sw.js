/* SFI Kompis service worker: works offline, fetches the newest version whenever online */
const V='sfi-f223dc6405';
const CORE=['/','/fonts/schibsted-grotesk.woff2','/favicon.svg','/icon-192.png','/icon-512.png','/icon-maskable-512.png','/apple-touch-icon.png','/site.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
  if(r.mode==='navigate'){ // page: newest from the network, cached copy when offline or slow
    e.respondWith(new Promise(res=>{let done=false;const fall=()=>caches.match('/').then(c=>{if(!done&&c){done=true;res(c)}});
      const t=setTimeout(fall,3500);
      fetch(r.url,{cache:'no-cache',credentials:'same-origin'}).then(n=>{clearTimeout(t);if(n.ok){const cp=n.clone();caches.open(V).then(c=>c.put('/',cp))}if(!done){done=true;res(n)}})
        .catch(()=>{clearTimeout(t);caches.match('/').then(c=>{if(!done){done=true;res(c||Response.error())}})})}));return}
  e.respondWith(caches.match(r).then(c=>c||fetch(r).then(n=>{if(n.ok&&(u.pathname.startsWith('/fonts/')||/\.(png|svg|webmanifest)$/.test(u.pathname))){const cp=n.clone();caches.open(V).then(cc=>cc.put(r,cp))}return n})))});
