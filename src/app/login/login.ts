import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ApiAuthService } from '../services/auth-service';
import { Auth0Service } from '../auth/auth0';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
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
  // 🌙 DARK MODE: load preference on start
  // ---------------------------------------------------
  ngOnInit() {
    this.loadThemePreference();
  }

  toggleDarkMode() {
    const body = document.body;
    const isDark = body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const finalTheme = savedTheme ?? (prefersDark ? 'dark' : 'light');

    document.body.classList.toggle('dark', finalTheme === 'dark');
    localStorage.setItem('theme', finalTheme);
  }

  // ---------------------------------------------------
  // 🔐 API Login
  // ---------------------------------------------------
  onLogin() {
    if (!this.username || !this.password) {
      this.message = 'Please enter username & password.';
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
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.message = err.error?.message || 'Invalid username or password';
      }
    });
  }

  // ---------------------------------------------------
  // 🔐 API Logout
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
  // 🟦 Auth0 Login
  // ---------------------------------------------------
  loginWithAuth0() {
    this.auth0.login();
  }
}
