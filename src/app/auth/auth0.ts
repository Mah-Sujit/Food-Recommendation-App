// src/app/auth/auth0.service.ts

import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root'
})
export class Auth0Service {

  constructor(private auth: AuthService) {}

  /** LOGIN WITH AUTH0 */
  login() {
    return this.auth.loginWithRedirect({
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    });
  }

  /** LOGOUT OF AUTH0 */
  logout() {
    return this.auth.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  }

  /** GET CURRENT AUTH0 USER PROFILE */
  getUser() {
    return this.auth.user$;     // returns Observable<User>
  }

  /** CHECK IF USER IS LOGGED IN */
  isAuthenticated() {
    return this.auth.isAuthenticated$;   // Observable<boolean>
  }

  /** GET ACCESS TOKEN SILENTLY */
  getToken() {
    return this.auth.getAccessTokenSilently();
  }
}
