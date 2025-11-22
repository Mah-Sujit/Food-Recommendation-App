import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular'; 
import { DOCUMENT } from '@angular/core'; 
import { AsyncPipe } from '@angular/common'; 
import { CommonModule } from '@angular/common';
import { Inject } from '@angular/core';
import { Router } from'@angular/router';

@Component({
  selector: 'app-authbutton',
  imports: [AsyncPipe,CommonModule],
  providers: [Router],
  templateUrl: './authbutton.html',
  styleUrl: './authbutton.css',
})
export class Authbutton {
constructor(@Inject(DOCUMENT) public document: Document, 
public auth: AuthService,
public router: Router) {}


login() {
    this.auth.loginWithRedirect();
  }

  logout() {
    this.auth.logout({
      logoutParams: { returnTo: this.document.location.origin }
    });
  }
}
