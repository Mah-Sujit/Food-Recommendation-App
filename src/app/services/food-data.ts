import { Injectable } from '@angular/core';
import jsonData from '../../assets/food.food_dataset.json';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FoodData {

  pageSize: number=10;

  constructor( private http: HttpClient) { }

    populateReviews() {
      let loremIpsum: string = "";
      let dummyReview: any = {};
      
      this.getLoremIpsum(1).subscribe( (response: any) => {
        loremIpsum = response.text;
        jsonData.forEach( function(food:any){
          let numReviews = Math.floor(Math.random() * 10);
          for (var i = 0; i < numReviews; i++) {
            let textSize = Math.floor(Math.random() * 290 + 10);
            let textStart = Math.floor(Math.random() * (loremIpsum.length - textSize));

            
            dummyReview = {
              'username' : 'User ' + Math.floor(Math.random() * 9999 + 1),
              
              'comment' : loremIpsum.slice(textStart, textStart + textSize),
              
              'stars' : Math.floor( Math.random() * 5 + 1 )
            };
            food['reviews']. push(dummyReview);
          }
          })
        })
      }
     

  getFoods(page: number){
    let pageStart = (page - 1) * this.pageSize; //let - partially global and local, var - for local variables.
    let pageEnd = pageStart + this.pageSize;
    return jsonData.slice(pageStart, pageEnd);
  }

  getLastPageNumber(){
    return Math.ceil(jsonData.length / this.pageSize);
  }

  getFood(id:any){
    let dataToReturn:any[] =[];
    jsonData.forEach(function(food: any) {  
      if (food._id.$oid == id) {
          dataToReturn.push(food);
}
    })
return dataToReturn;

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

  // ------------------ FE14: Temperature Colour Helper ------------------
  getTemperatureColour(temp: number) {
    if (temp <= 5) return "#0000ff";     // Blue
    else if (temp <= 12) return "#00ff00"; // Green
    else if (temp <= 17) return "#ffff00"; // Yellow
    else if (temp <= 25) return "#ff7f00"; // Orange
    else return "#ff0000";                 // Red
  }
  // ------------------ FE14: Post Review ------------------
postReview(id: any, review: any) { 
  let newReview = { 
    username: review.username, 
    review: review.comment, 
    star: review.stars 
  }; 

  jsonData.forEach(function(food: any) { 
    if (food._id.$oid == id) { 
      food['reviews'].push(newReview); 
    } 
  }); 
}
}