import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ApiAuthService {
  private baseUrl = "http://localhost:5000";

  private apiUrl = 'http://127.0.0.1:5001/login';
  isLoggedIn$ = new BehaviorSubject<boolean>(false);
  currentUser$ = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    this.restoreLoginState();
    const existingToken = localStorage.getItem("token");
  if (existingToken) this.startTokenWatcher();
  }

  // RESTORE LOGIN ON PAGE REFRESH
  private restoreLoginState() {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token && username) {
      this.isLoggedIn$.next(true);
      this.currentUser$.next(username);
    }
  }

  login(username: string, password: string): Observable<any> {
    const basicToken = btoa(`${username}:${password}`);

    const headers = new HttpHeaders({
      Authorization: `Basic ${basicToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });


    const body = { username, password }; 

    return this.http.post('http://127.0.0.1:5001/login',body, { headers });
  }
// SIGNUP   <-- THIS FIXES YOUR ERROR
  // ==========================
  signup(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, data);
  }

logout(token: string) {
  const headers = new HttpHeaders({
    'x-access-token': token
  });

  return this.http.post('http://127.0.0.1:5001/logout', {}, { headers });
}

  
  // Save login state
  setLoginState(username: string, token: string) {
    this.isLoggedIn$.next(true);
    this.currentUser$.next(username);

    localStorage.setItem('username', username);
    localStorage.setItem('token', token);

    this.startTokenWatcher();
  }

  clearLoginState() {
    this.isLoggedIn$.next(false);
    this.currentUser$.next(null);

    localStorage.removeItem("username");
    localStorage.removeItem("token");
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // ADMIN CHECK
  isAdmin(): boolean {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.admin === true;
    } catch {
      return false;
    }
  }

  getTokenPayload() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}
startTokenWatcher() {
  const payload = this.getTokenPayload();
  if (!payload?.exp) return;

  const expiryTime = payload.exp * 1000;
  const now = Date.now();
  const timeout = expiryTime - now;

  // Token already expired → logout user immediately
  if (timeout <= 0) {
    this.forceLogout();
    return;
  }

  // Auto logout when the token actually expires
  setTimeout(() => {
    this.forceLogout();
  }, timeout);
}
forceLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    this.isLoggedIn$.next(false);
    this.currentUser$.next(null);

    window.location.href = '/login';
  }
  
}
