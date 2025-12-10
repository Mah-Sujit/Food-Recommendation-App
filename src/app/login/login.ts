import { Component } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,     // <-- 🔥 REQUIRED FOR ROUTING
  imports: [CommonModule, ReactiveFormsModule, FormsModule,RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  username: string = '';
  password: string = '';

  message: string = '';
  token: string | null = null;

  constructor(private authService: AuthService,
    private router: Router) { }

  onLogin() {
    if (!this.username || !this.password) {
      this.message = 'Please enter username & password.';
      return;
    }

    console.log("Login clicked"); 
    this.authService.login(this.username, this.password).subscribe({
  next: (res) => {
    console.log("LOGIN RESPONSE:", res);

    const token = res.Token || res.token || res.jwt; // try all possible keys

    if (!token) {
      this.message = "No token received from backend";
      return;
    }

    this.authService.setLoginState(this.username, token);
    this.message = "Login successful!";
    this.router.navigate(['/']);
  },
  error: (err) => {
    this.message = err.error?.message || 'Login error';
  }
});
  }


  onLogout() {
     const token = this.authService.getToken();
    if (!this.token) return;

    this.authService.logout(this.token).subscribe({
      next: () => {
        this.authService.clearLoginState();
        this.token = null;
        this.router.navigate(['/login']);
      }
    });
  }

}
