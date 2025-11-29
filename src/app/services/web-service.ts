import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebServices {

  pageSize: number = 3;
  total_pages = 1;

  constructor(private http: HttpClient) { }

  getfoods(page: number){
    return this.http.get<any>(
      'http://127.0.0.1:5001/food?pn=' +
      page + '&ps=' + this.pageSize
      );
  }
  getfood(id: any){
    return this.http.get<any>(
      'http://127.0.0.1:5001/food /'+ id
    );
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
      'http://127.0.0.1:5001/business/'+ id + '/reviews'
    );
  }

  postReview(id: any, review: any){
    let postData = new FormData();
    postData.append("username", review.username);
    postData.append("comment", review.comment);
    postData.append("stars", review.stars);

    return this.http.post<any>(
        'http://127.0.0.1:5001/business/' + id + '/reviews',
        postData);
}
}