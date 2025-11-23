import { Injectable } from '@angular/core';
import jsonDataRaw from '../../assets/food.food_dataset.json';

const jsonData: any[] = jsonDataRaw as any[];
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FoodData {

  pageSize: number = 10;

  constructor(private http: HttpClient) {}

  // ------------------ Generate Dummy Reviews ------------------
  populateReviews() {
    let loremIpsum = '';

    this.getLoremIpsum(1).subscribe((response: any) => {
      loremIpsum = response.text;

      jsonData.forEach((doc: any) => {
        // Ensure there is a CustomerReviews array on each doc
        if (!doc.CustomerReviews) {
          doc.CustomerReviews = [];
        }

        const numReviews = Math.floor(Math.random() * 10);

        for (let i = 0; i < numReviews; i++) {
          const textSize = Math.floor(Math.random() * 290 + 10);
          const textStart = Math.floor(Math.random() * (loremIpsum.length - textSize));

          const dummyReview = {
            username: 'User ' + Math.floor(Math.random() * 9999 + 1),
            comment: loremIpsum.slice(textStart, textStart + textSize),
            // underlying JSON uses "star"
            star: Math.floor(Math.random() * 5 + 1)
          };

          doc.CustomerReviews.push(dummyReview);
        }
      });
    });
  }

  // ------------------ LIST FOODS (flattened shape) ------------------
  getFoods(page: number) {
    const pageStart = (page - 1) * this.pageSize;
    const pageEnd = pageStart + this.pageSize;

    return jsonData.slice(pageStart, pageEnd).map((doc: any) => {
      const biz = doc.Businesses[0];

      return {
        id: doc.FHRSID,
        name: biz.BusinessName,
        town: biz.Location.Address.City,
        rating: biz.Ratings?.[0]?.Value ?? 0,
        lat: biz.Location.Coordinates.Latitude,
        lng: biz.Location.Coordinates.Longitude,
        reviews: (doc.CustomerReviews || []).map((r: any) => ({
          username: r.username,
          comment: r.comment,
          stars: r.star
        }))
      };
    });
  }

  getLastPageNumber() {
    return Math.ceil(jsonData.length / this.pageSize);
  }

  // ------------------ SINGLE FOOD BY ID (flattened) ------------------
  getFood(id: any) {
    const doc = jsonData.find((d: any) => d.FHRSID == id);
    if (!doc) return null;

    const biz = doc.Businesses[0];

    return {
      id: doc.FHRSID,
      name: biz.BusinessName,
      town: biz.Location.Address.City,
      rating: biz.Ratings?.[0]?.Value ?? 0,
      lat: biz.Location.Coordinates.Latitude,
      lng: biz.Location.Coordinates.Longitude,
      reviews: (doc.CustomerReviews || []).map((r: any) => ({
        username: r.username,
        comment: r.comment,
        stars: r.star
      }))
    };
  }

  // ------------------ FE14: Lorem Ipsum API ------------------
  getLoremIpsum(paragraphs: number): Observable<any> {
    const API_KEY = 'DtUmNNozJWdZQaT2ernjMw==T0rWimQybxCZTdWV';
    return this.http.get<any>(
      `https://api.api-ninjas.com/v1/loremipsum?paragraphs=${paragraphs}`,
      {
        headers: { 'X-Api-Key': API_KEY }
      }
    );
  }

  // ------------------ FE14: Weather API ------------------
  getCurrentWeather(lat: number, lon: number): Observable<any> {
    const API_KEY = '3d2e11a64980bf4bdb6eec72fba8aada';

    return this.http.get<any>(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
  }

  // ------------------ Temperature Colour Helper ------------------
  getTemperatureColour(temp: number) {
    if (temp <= 5) return '#0000ff';      // Blue
    else if (temp <= 12) return '#00ff00'; // Green
    else if (temp <= 17) return '#ffff00'; // Yellow
    else if (temp <= 25) return '#ff7f00'; // Orange
    else return '#ff0000';                 // Red
  }

  // ------------------ Post Review ------------------
  postReview(id: any, review: any) {
    const newReview = {
      username: review.username,
      comment: review.comment,
      star: review.stars
    };

    jsonData.forEach((doc: any) => {
      if (doc.FHRSID == id) {
        if (!doc.CustomerReviews) {
          doc.CustomerReviews = [];
        }
        doc.CustomerReviews.push(newReview);
      }
    });
  }
}
