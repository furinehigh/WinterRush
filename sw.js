const cacheName = 'winter-v1'
self.addEventListener('install', e=> {
    e.waitUntil(caches.open(cacheName).then(c=>c.addAll([
        '/', '/index.html', '/src/game.js',
        '/src/scenes/Preload.js', '/src/scenes/Game.js','/assets/fonts/SnowtopCaps.ttf',
            '/assets/bg/bg_still.jpg',
            '/assets/player/player.png',
            '/assets/player/player_jump.png',
            '/assets/player/player_slide.png',
            '/assets/obstacles/tree.png',
            '/assets/obstacles/rock.png'
    ])))
})

self.addEventListener('fetch', e=>{
    e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request)))
})