import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  imports: [RouterModule,CommonModule],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css',
})
export class Navigation {
  isLoggedIn = false;
  username: string | null = null;

  isLoggedIn$!: BehaviorSubject<boolean>;
currentUser$!: BehaviorSubject<string | null>;


  constructor(private authService: AuthService,
    private router: Router,
     public auth: AuthService,
) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(val => this.isLoggedIn = val);
    this.authService.currentUser$.subscribe(name => this.username = name);
  }

  onLogout(): void {
    this.authService.clearLoginState();
    // optionally navigate somewhere, e.g.:
    // this.router.navigate(['/login']);
    localStorage.removeItem("token");
  localStorage.removeItem("username");
  this.router.navigate(['/login']);
  }
}