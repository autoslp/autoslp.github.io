const CACHE_NAME = 'carton-manager-v1';
const urlsToCache = [
  './',
  './index.html',
  './dashboard.html',
  './lenh-san-xuat.html',
  './theo-doi.html',
  './bao-cao.html',
  './styles.css',
  './app.js',
  './images/logo.svg',
  './images/favicon.svg',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css',
  'https://cdn.jsdelivr.net/npm/flatpickr',
  'https://cdn.jsdelivr.net/npm/flatpickr/dist/l10n/vn.js',
  'https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns'
];

// Cài đặt Service Worker và cache các tài nguyên tĩnh
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate và xóa các cache cũ
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Xóa cache cũ không còn được dùng
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Xử lý các request
self.addEventListener('fetch', event => {
  // Chiến lược cache-first, fallback to network
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Trả về response từ cache nếu tìm thấy
        if (response) {
          return response;
        }

        // Clone request vì request chỉ có thể được sử dụng 1 lần
        const fetchRequest = event.request.clone();

        // Nếu không có trong cache, tìm trên mạng
        return fetch(fetchRequest).then(response => {
          // Kiểm tra response hợp lệ
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone response vì response cũng chỉ có thể được sử dụng 1 lần
          const responseToCache = response.clone();

          // Thêm response vào cache cho lần sau
          caches.open(CACHE_NAME)
            .then(cache => {
              // Không cache API calls
              if (!event.request.url.includes('/api/')) {
                cache.put(event.request, responseToCache);
              }
            });

          return response;
        });
      })
  );
});

// Xử lý thông báo push
self.addEventListener('push', event => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: './images/icon-192x192.png',
    badge: './images/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || './'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Xử lý khi click vào thông báo
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data.url;
  
  event.waitUntil(
    clients.matchAll({type: 'window'})
      .then(windowClients => {
        // Nếu tab đã mở, focus vào nó
        for (const client of windowClients) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        // Nếu chưa mở, mở tab mới
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// Xử lý khi có cập nhật service worker
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
}); 