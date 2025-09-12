import { Router } from '@vaadin/router';

export class RouterService {
  constructor(outlet) {
    this.router = new Router(outlet);
    this.setupRoutes();
  }
  
  setupRoutes() {
    this.router.setRoutes([
      {
        path: '/',
        component: 'showcase-view',
        action: async () => {
          await import('../views/showcase-view.js');
        }
      },
      {
        path: '/todos',
        component: 'todos-view',
        action: async () => {
          await import('../views/todos-view.js');
        }
      },
      {
        path: '/todos/:variant',
        component: 'todos-view',
        action: async () => {
          await import('../views/todos-view.js');
        }
      },
      {
        path: '/analytics',
        component: 'analytics-view',
        action: async () => {
          await import('../views/analytics-view.js');
        }
      },
      {
        path: '/widgets',
        component: 'widgets-view',
        action: async () => {
          await import('../views/widgets-view.js');
        }
      },
      {
        path: '/profile',
        component: 'profile-view',
        action: async () => {
          await import('../views/profile-view.js');
        }
      },
      {
        path: '/settings',
        component: 'settings-view',
        action: async () => {
          await import('../views/settings-view.js');
        }
      },
      {
        path: '(.*)',
        component: 'not-found-view',
        action: async () => {
          await import('../views/not-found-view.js');
        }
      }
    ]);
  }
  
  navigate(path) {
    Router.go(path);
  }
  
  getLocation() {
    return this.router.location;
  }
  
  setOutlet(outlet) {
    this.router.setOutlet(outlet);
  }
  
  addRoute(route) {
    const routes = [...this.router.getRoutes(), route];
    this.router.setRoutes(routes);
  }
  
  removeRoute(path) {
    const routes = this.router.getRoutes().filter(route => route.path !== path);
    this.router.setRoutes(routes);
  }
}