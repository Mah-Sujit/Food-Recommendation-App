import { Injectable } from '@angular/core';
import jsonDataRaw from '../../assets/food.food_dataset.json';

const jsonData: any[] = jsonDataRaw as any[];
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FoodData {

  pageSize: number = 3;
  
  constructor(private http: HttpClient ){ }

  populateReviews() {
  let loremIpsum: string = "";
      let dummyReview: any = {};
      
      this.getLoremIpsum(1).subscribe( (response: any) => {
        loremIpsum = response.text;
        jsonData.forEach( function(business){
          let numReviews = Math.floor(Math.random() * 10);
          for (var i = 0; i < numReviews; i++) {
            let textSize = Math.floor(Math.random() * 290 + 10);
            let textStart = Math.floor(Math.random() * (loremIpsum.length - textSize));

            
            dummyReview = {
              'username' : 'User ' + Math.floor(Math.random() * 9999 + 1),
              
              'comment' : loremIpsum.slice(textStart, textStart + textSize),
              
              'stars' : Math.floor( Math.random() * 5 + 1 )
            };
            business['reviews']. push(dummyReview);
          }
          })
        })
      }

  getFoods(page: number) {
    let pageStart = (page - 1) * this.pageSize;
    let pageEnd = pageStart + this.pageSize; 
    return jsonData.slice(pageStart,pageEnd);
  }
  
  getLastPageNumber(){
    return Math.ceil(jsonData.length / this.pageSize);
  }

  getfood(id: any){
    let dataToReturn: any = [];
    jsonData.forEach(function(food){
      if (food._id.$oid == id){
        dataToReturn.push(food);
      }
    })
    return dataToReturn;
  }
  getLoremIpsum(paragraphs: number) : Observable<any> {
    let API_key = "DtUmNNozJWdZQaT2ernjMw==T0rWimQybxCZTdWV";
    return this.http.get<any>(
      'https://api.api-ninjas.com/v1/' 
      + 'loremipsum?paragraphs=' + paragraphs,{headers:{'X-Api-key': API_key}}
    )
  }
getCurrentWeather(lat: number, lon: number) {
  const API_KEY = '3d2e11a64980bf4bdb6eec72fba8aada';

  return this.http.get<any>(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );
}

getTemperatureColour(temp: number) {
  if (temp <= 5) return '#0000ff';      // Blue
  if (temp <= 12) return '#00ff00';     // Green
  if (temp <= 17) return '#ffff00';     // Yellow
  if (temp <= 25) return '#ff7f00';     // Orange
  return '#ff0000';                     // Red
}

postReview(id: any, review: any) { 
  let newReview = { 
    username: review.username, 
    review: review.comment, 
    stars: review.stars 
  }; 

  jsonData.forEach(function(business) { 
    if (business._id.$oid == id) { 
      business['reviews'].push(newReview); 
    } 
  }); 
}
}
