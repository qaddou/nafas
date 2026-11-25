// يحفظ صفحات يَقَظة على الجوال عشان تفتح بدون نت. بياناتك نفسها في الشيت، ونسخة منها في الجهاز
const CACHE = 'yaqatha-v3';
const FILES = ['./', 'index.html', 'luqma.html', 'qirsh.html', 'mufakkira.html', 'manifest.json', 'icon-192.png?v=2', 'icon-512.png?v=2', 'icon-maskable.png?v=2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin || e.request.method !== 'GET') return; // Apps Script والخطوط تمر مباشرة
  // الأحدث من النت أول، وإذا ما فيه نت ياخذ المحفوظ
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html'))));
});
