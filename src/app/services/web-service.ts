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
 private baseUrl = 'http://127.0.0.1:5001/food';


  constructor(private http: HttpClient) { }

  getfoods(page: number, pageSize: number = 50) {
  return this.http.get<any>(
    `http://127.0.0.1:5001/food/?pn=${page}&ps=${pageSize}`
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
  getUserReviews(id: string) {
  return this.http.get<any>(`http://127.0.0.1:5001/food/${id}/reviews`);
}

postReview(id: string, review: any) {
  let formData = new FormData();
  formData.append("username", review.username);
  formData.append("comment", review.comment);
  formData.append("stars", review.stars);

  return this.http.post(
    `http://127.0.0.1:5001/food/${id}/reviews`,
    formData
  );
}

// Create new food
  addFood(food: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/`, food);
  }

  // Update food
  updateFood(id: string, food: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, food);
  }

  // Delete food
  deleteFood(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

getUserFavourites(username: string) {
  return this.http.get<any>(`http://127.0.0.1:5001/user/${username}/favourites`);
}

addReview(data: any) {
  return this.http.post(`http://127.0.0.1:5001/reviews`, data);
}

addFavourite(username: string, foodId: string) {
  return this.http.post(`http://127.0.0.1:5001/user/${username}/favourites`, { foodId });
}

}
