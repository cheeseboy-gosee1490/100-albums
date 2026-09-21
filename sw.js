const CACHE="100-albums-v4";
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(["./","./manifest.webmanifest"])).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET")return;
 const url=new URL(e.request.url);
 if(url.origin===location.origin && (url.pathname.endsWith("/")||url.pathname.endsWith("/index.html"))){
  e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match("./"))));
  return;
 }
 e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(x=>{if(url.origin===location.origin){const copy=x.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return x}).catch(()=>caches.match("./"))));
});