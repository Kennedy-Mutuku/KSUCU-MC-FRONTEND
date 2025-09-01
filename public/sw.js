const CACHE_NAME = 'ksucu-v1';
const STATIC_CACHE_NAME = 'ksucu-static-v1';
const DYNAMIC_CACHE_NAME = 'ksucu-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/offline.html',
  // Add commonly used assets
  '/src/assets/cuLogoUAR.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS.map(url => {
          return new Request(url, { cache: 'reload' });
        }));
      })
      .catch((error) => {
        console.error('Failed to cache static assets:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests (different origin)
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('Serving from cache:', request.url);
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetch(request)
          .then((networkResponse) => {
            // Don't cache failed responses
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }

            // Clone the response for caching
            const responseClone = networkResponse.clone();

            // Cache dynamic content
            caches.open(DYNAMIC_CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              });

            return networkResponse;
          })
          .catch(() => {
            console.log('Network failed, showing offline page');
            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            // Return a simple offline response for other requests
            return new Response('Offline', {
              status: 200,
              statusText: 'Offline'
            });
          });
      })
  );
});

// Handle background sync for form submissions when back online
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  if (event.tag === 'attendance-sync') {
    event.waitUntil(syncAttendanceData());
  }
});

// Sync attendance data when back online
async function syncAttendanceData() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const requests = await cache.keys();
    
    // Process any pending attendance submissions
    for (const request of requests) {
      if (request.url.includes('/attendance/') && request.method === 'POST') {
        try {
          await fetch(request);
          await cache.delete(request);
        } catch (error) {
          console.error('Failed to sync attendance data:', error);
        }
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Handle push notifications (future enhancement)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/src/assets/cuLogoUAR.png',
      badge: '/src/assets/cuLogoUAR.png',
      vibrate: [200, 100, 200],
      data: data.data
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});