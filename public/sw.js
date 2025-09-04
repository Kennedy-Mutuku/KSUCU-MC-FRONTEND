// Minimal service worker - no caching for dynamic content
const CACHE_NAME = 'ksucu-v2';

// Install event - skip waiting immediately
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

// Activate event - claim clients immediately
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - NO CACHING, always fetch from network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // For API calls, always fetch from network
  if (request.url.includes('/api/') || 
      request.url.includes('localhost:3000') || 
      request.url.includes('localhost:5000') ||
      request.url.includes('ksucu-mc.co.ke')) {
    event.respondWith(
      fetch(request, {
        cache: 'no-store',
        headers: {
          ...request.headers,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }).catch(() => {
        return new Response('Network error', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
    );
    return;
  }
  
  // For other resources, just fetch normally
  event.respondWith(fetch(request));
});

// Handle background sync - disabled for now
self.addEventListener('sync', (event) => {
  console.log('Background sync disabled');
});

// Handle push notifications
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