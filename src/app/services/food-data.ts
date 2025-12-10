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
  images: { [key: string]: string } = {
  "pizza": "assets/images/pizza-restaurant.jpg",
  "burger": "assets/images/burger-shop.jpg",
  "cafe": "assets/images/cafe.jpg",
  "coffee": "assets/images/cafe.jpg",
  "chicken": "assets/images/chicken-food.jpg",
  "thai": "assets/images/thai-food.jpg",
  "indian": "assets/images/indian-food.jpg",
  "asian": "assets/images/asian-noodles.jpg",
  "noodle": "assets/images/asian-noodles.jpg",
  "kebab": "assets/images/kebab-shop.jpg",
  "mexican": "assets/images/mexican-food.jpg",
  "taco": "assets/images/mexican-food.jpg",
  "bbq": "assets/images/bbq-food.jpg",
  "japan": "assets/images/sushi.jpg",
  "sushi": "assets/images/sushi.jpg"
};

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
            if (!business['CustomerReviews']) { 
              business['CustomerReviews'] = [];} 
              business['CustomerReviews'].push(dummyReview);


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
  getFoodsFromApi(page: number, pageSize: number) {
  const url = `http://127.0.0.1:5001/food?pn=${page}&ps=${pageSize}`;
  return this.http.get<any>(url);
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
  const newReview = { 
    username: review.username, 
    comment: review.comment, 
    stars: review.stars 
  }; 

  jsonData.forEach((food: any) => { 
    if (food._id.$oid == id) { 
      
      if (!food['CustomerReviews']) {
        food['CustomerReviews'] = [];
      }

      food['CustomerReviews'].push(newReview); 
    } 
  }); 
}
getImageForBusiness(name: string): string {
  if (!name) return "assets/images/restaurant-default.jpg";

  // Clean the name: remove symbols like @, &, /, ', etc.
  const key = name.toLowerCase().replace(/[^a-z0-9 ]/g, "");

  const lowered = name.toLowerCase();

  // Category-based image rules
  if (lowered.includes("pizza")) return "assets/images/pizza-restaurant.jpg";
  if (lowered.includes("burger")) return "assets/images/burger-shop.jpg";
  if (lowered.includes("cafe") || lowered.includes("coffee")) return "assets/images/cafe.jpg";
  if (lowered.includes("chicken")) return "assets/images/chicken-food.jpg";
  if (lowered.includes("thai")) return "assets/images/thai-food.jpg";
  if (lowered.includes("indian")) return "assets/images/indian-food.jpg";
  if (lowered.includes("asian") || lowered.includes("noodle")) return "assets/images/asian-noodles.jpg";
  if (lowered.includes("kebab")) return "assets/images/kebab-shop.jpg";
  if (lowered.includes("mexican") || lowered.includes("taco")) return "assets/images/mexican-food.jpg";
  if (lowered.includes("bbq")) return "assets/images/bbq-food.jpg";
  if (lowered.includes("japan") || lowered.includes("sushi")) return "assets/images/sushi.jpg";

  // Default image OR image from your predefined dictionary
  return this.images[key] || "assets/images/restaurant-default.jpg";

}
}
