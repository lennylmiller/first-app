const CACHE_NAME = 'dashboard-v1';
const urlsToCache = [
  '/dashboard.html',
  '/src/dashboard/app-dashboard.js',
  '/src/dashboard/styles/shared-styles.js',
  '/src/dashboard/services/theme-service.js',
  '/src/dashboard/services/storage-service.js',
  '/src/dashboard/services/keyboard-shortcuts-service.js',
  '/src/dashboard/views/todos-view.js',
  '/src/dashboard/views/analytics-view.js',
  '/src/dashboard/views/widgets-view.js',
  '/src/dashboard/views/settings-view.js',
  '/src/dashboard/views/overview-view.js',
  '/src/dashboard/components/app-sidebar.js',
  '/src/dashboard/components/app-header.js',
  '/src/dashboard/components/app-search-bar.js',
  '/src/dashboard/components/app-notifications.js',
  '/src/dashboard/components/app-user-menu.js',
  '/src/dashboard/components/dashboard-widget.js',
  '/src/dashboard/components/theme-editor.js'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.log('Cache failed:', err);
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type === 'opaque') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Only cache successful responses for same-origin or CORS-enabled resources
          if (event.request.url.startsWith(self.location.origin) || 
              event.request.url.includes('cdn.') || 
              event.request.url.includes('unpkg.com')) {
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
          }

          return response;
        });
      })
      .catch(() => {
        // Offline fallback for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/dashboard.html');
        }
        // Return offline placeholder for other resources
        return new Response('Offline - resource not cached', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        });
      })
  );
});

// Handle messages from the client
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            return caches.delete(cacheName);
          })
        );
      }).then(() => {
        return self.clients.matchAll();
      }).then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'CACHE_CLEARED',
            message: 'All caches have been cleared'
          });
        });
      })
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-todos') {
    event.waitUntil(syncTodos());
  }
});

async function syncTodos() {
  // This would sync todos with a backend when online
  // For now, just log that sync happened
  console.log('Background sync: Syncing todos...');
  
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({
      type: 'SYNC_COMPLETE',
      message: 'Todos synced successfully'
    });
  });
}

// Push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Dashboard App', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/dashboard.html')
  );
});