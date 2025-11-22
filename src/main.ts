import { bootstrapApplication } from '@angular/platform-browser';
import { provideAuth0 } from '@auth0/auth0-angular';
import { provideHttpClient } from '@angular/common/http';
import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, {
  providers: [
    provideAuth0({
      domain: 'dev-b15cmrlih70ewqe0.us.auth0.com',
      clientId: 'LAy68YCzjmnUh6jP5hCYgE54VfOK8KAc',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }),
    provideHttpClient(),
    appConfig.providers
  ]
}).catch((err) => console.error(err));
