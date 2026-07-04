/* ちきゅうのメロディ EARTH MELODY — オフライン用 Service Worker（任意）
   使い方：このsw.jsを game.html と同じフォルダに置いて、
   https:// か localhost で配信すれば「一度ひらけば電波なしでも起動」できる。
   ※ file:// 直開きや未配置でも、本体は何も壊れません（登録が静かに失敗するだけ）。*/
const CACHE = 'earth-melody-v1';

self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then(hit =>
      hit || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match(req))
    )
  );
});
