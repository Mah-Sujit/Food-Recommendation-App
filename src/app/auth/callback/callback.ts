import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: `<p>Signing you in...</p>`
})
export class CallbackComponent {

  constructor(public auth: AuthService) {}
}
