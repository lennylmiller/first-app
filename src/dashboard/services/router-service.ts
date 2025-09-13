import { Router, Route } from '@vaadin/router';

export class RouterService {
  private router: Router;

  constructor(outlet: Element | null) {
    this.router = new Router(outlet as HTMLElement);
    this.setupRoutes();
  }
  
  setupRoutes(): void {
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
  
  navigate(path: string): void {
    (Router as any).go(path);
  }
  
  getLocation(): any {
    return (this.router as any).location;
  }
  
  setOutlet(outlet: Element | null): void {
    (this.router as any).setOutlet(outlet);
  }
  
  addRoute(route: Route): void {
    const routes = [...(this.router as any).getRoutes(), route];
    this.router.setRoutes(routes);
  }
  
  removeRoute(path: string): void {
    const routes = (this.router as any).getRoutes().filter((route: any) => route.path !== path);
    this.router.setRoutes(routes);
  }
}