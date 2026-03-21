// Safe service worker - minimal interference with API calls
const CACHE_NAME = 'ksucu-v4';

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
  if (request.method !== 'GET' ||
      request.url.includes('/users/') ||
      request.url.includes('/attendance/') ||
      request.url.includes('/api/') ||
      request.url.includes('/overseer/') ||
      request.url.includes('/adminnews/') ||
      request.url.includes('/adminmission/') ||
      request.url.includes('/adminBs/') ||
      request.url.includes('/sadmin/') ||
      request.url.includes('/admissionadmin/') ||
      request.url.includes('/news/') ||
      request.url.includes('/messages/') ||
      request.url.includes('/chat/') ||
      request.url.includes('/commitmentForm/') ||
      request.url.includes('/polling-officer/') ||
      request.url.includes('/documents/') ||
      request.url.includes('/minutes/') ||
      request.url.includes('/media-items') ||
      request.url.includes('/requisitions') ||
      request.url.includes('/settings/') ||
      request.url.includes('localhost:3000') ||
      request.url.includes('localhost:5000') ||
      (url.hostname === 'ksucu-mc.co.ke' && (
        url.pathname.includes('/users/') ||
        url.pathname.includes('/attendance/') ||
        url.pathname.includes('/api/') ||
        url.pathname.includes('/overseer/')
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