import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ApiAuthService } from '../services/auth-service';
import { Auth0Service } from '../auth/auth0';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {

  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;

  message: string = '';

  constructor(
    private apiAuth: ApiAuthService,
    private router: Router,
    public auth0: Auth0Service
  ) {}

  // ---------------------------------------------------
  // 🌙 Load saved theme on app start
  // ---------------------------------------------------
  ngOnInit() {
    this.loadThemePreference();
  }

  toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  loadThemePreference() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const theme = saved ?? (prefersDark ? "dark" : "light");

    document.body.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }

  // ---------------------------------------------------
  // 🔐 Backend Login
  // ---------------------------------------------------
  onLogin() {
    if (!this.username || !this.password) {
      this.message = "Please enter username & password.";
      return;
    }

    this.apiAuth.login(this.username, this.password).subscribe({
      next: (res) => {
        const token = res.token || res.Token || res.jwt;

        if (!token) {
          this.message = "No token received";
          return;
        }

        this.apiAuth.setLoginState(this.username, token);

        if (this.rememberMe) {
          localStorage.setItem("rememberUser", this.username);
        }

        this.router.navigate(['/']);
      },
      error: (err) => {
        this.message = err.error?.message || "Invalid username or password";
      }
    });
  }

  // ---------------------------------------------------
  // 🔐 Logout API
  // ---------------------------------------------------
  onLogout() {
    const token = this.apiAuth.getToken();
    if (!token) return;

    this.apiAuth.logout(token).subscribe({
      next: () => {
        this.apiAuth.clearLoginState();
        this.router.navigate(['/login']);
      }
    });
  }

  // ---------------------------------------------------
  // 🟦 Auth0
  // ---------------------------------------------------
  loginWithAuth0() {
    this.auth0.login();
  }

  // ---------------------------------------------------
  // 🔵 Google Login (UI only, no backend yet)
  // ---------------------------------------------------
  loginWithGoogle() {
    alert("Google login integration coming soon!");
  }

  // ---------------------------------------------------
  // 🔵 Facebook Login (UI only)
  // ---------------------------------------------------
  loginWithFacebook() {
    alert("Facebook login integration coming soon!");
  }
}
