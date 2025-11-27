const cacheName = 'winter-v1'
self.addEventListener('install', e=> {
    e.waitUntil(caches.open(cacheName).then(c=>c.addAll([
        '/', '/index.html', '/src/game.js',
        '/src/scenes/Preload.js', '/src/scenes/Game.js'
    ])))
})

self.addEventListener('fetch', e=>{
    e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request)))
})