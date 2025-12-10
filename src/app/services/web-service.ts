import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WebServices {

  pageSize: number = 3;
  total_pages = 1;
 private baseUrl = 'http://127.0.0.1:5001';


  constructor(private http: HttpClient) { }

  getfoods(page: number){
    return this.http.get<any>(
      'http://127.0.0.1:5001/food?pn=' +
      page + '&ps=' + this.pageSize
      );
  }
  getfood(id: any) {
  return this.http.get<any>(`http://127.0.0.1:5001/food/${id}`);
}

  getLoremIpsum(paragraphs: number) : Observable<any> {
    let API_key = "vv+za+RgHsTXo8vvvL+nlw==9RyEkIgssHV93UmE";
    return this.http.get<any>(
      'https://api.api-ninjas.com/v1/' 
      + 'loremipsum?paragraphs=' + paragraphs,{headers:{'X-Api-key': API_key}}
    )
  }

  getReviews(id: any){
    return this.http.get<any>(
      'http://127.0.0.1:5001/food/${id}/reviews'
    );
  }

  postReview(id: any, review: any){
    let postData = new FormData();
    postData.append("username", review.username);
    postData.append("comment", review.comment);
    postData.append("stars", review.stars);

    return this.http.post<any>(
        'http://127.0.0.1:5001/food/${id}/reviews',
        postData);
}


  // NEW: create
  addFood(food: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/food`, food);
  }

  // NEW: update
  updateFood(id: string, food: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/food/${id}`, food);
  }

  // NEW: delete
  deleteFood(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/food/${id}`);
  }
}
