import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  isLoggedIn$ = new BehaviorSubject<boolean>(false);
  currentUser$ = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const basicToken = btoa(`${username}:${password}`)

    const headers = new HttpHeaders({
      Authorization: `Basic ${basicToken}`
    });

    return this.http.get('http://127.0.0.1:5001/login', {headers});
  }

  logout(token: string){
    const headers = new HttpHeaders({
      'x-access-token':token
    });

    return this.http.get('http://127.0.0.1:5001/logout', {headers});
  }

  
  //Helpers
  setLoginState(username: string, token: string) {
  this.isLoggedIn$.next(true);
  this.currentUser$.next(username);

  // Here 'token' EXISTS because it is a parameter.
  localStorage.setItem('username', username);
  localStorage.setItem('token', token);
}

  
  clearLoginState(){
    this.isLoggedIn$.next(false);
    this.currentUser$.next(null);
  }
   getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
