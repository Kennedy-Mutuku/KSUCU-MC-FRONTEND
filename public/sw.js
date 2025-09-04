// Safe service worker - minimal interference with API calls
const CACHE_NAME = 'ksucu-v3';

// Install event - skip waiting immediately
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

// Activate event - claim clients immediately and clear old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      self.clients.claim();
    })
  );
});

// Fetch event - minimal intervention, let browser handle everything
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip service worker for API calls entirely - let browser handle them
  if (request.url.includes('/users/') || 
      request.url.includes('/attendance/') || 
      request.url.includes('/api/') ||
      request.url.includes('localhost:3000') || 
      request.url.includes('localhost:5000') ||
      (url.hostname === 'ksucu-mc.co.ke' && (
        url.pathname.includes('/users/') ||
        url.pathname.includes('/attendance/') ||
        url.pathname.includes('/api/')
      ))) {
    // Don't intercept API calls at all
    return;
  }
  
  // For static resources only, use network-first approach
  event.respondWith(
    fetch(request).catch(() => {
      // If network fails, return a simple error
      return new Response('Offline', {
        status: 503,
        statusText: 'Service Unavailable'
      });
    })
  );
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