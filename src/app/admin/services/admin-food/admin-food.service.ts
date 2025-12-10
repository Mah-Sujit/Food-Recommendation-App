import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminFoodService {

  private apiUrl = 'http://127.0.0.1:5001/food';

  constructor(private http: HttpClient) {}

  // REAL GET REQUEST
  getAllFoods(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/?pn=${page}&ps=50`);
  }

  // REAL POST REQUEST
  addFood(food: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, food);
  }
}
