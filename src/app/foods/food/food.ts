import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FoodData } from '../../services/food-data';
import { CommonModule } from '@angular/common';
import { WebServices } from '../../services/web-service';
import { GoogleMapsModule } from '@angular/google-maps';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-food',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, ReactiveFormsModule],
  providers: [FoodData, WebServices],
  templateUrl: './food.html',
  styleUrls: ['./food.css'],
})
export class Food {
  food: any;
  food_list: any = [];
  food_lat: any;
  food_lng: any;                
  map_options: google.maps.MapOptions = {};
  map_locations: any[] = [];

  loremIpsum: any;
  temperature: any;
  weather: any;
  weatherIconURL: any;
  temperatureColour: any;

  reviewForm: any;
  reviews_list: any;


  constructor(private route: ActivatedRoute,
    private foodData: FoodData,
    private webService: WebServices,
    private formBuilder: FormBuilder,
    protected authService: AuthService
  ) {}
  
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    // build review form
    this.reviewForm = this.formBuilder.group({
      username: ['', Validators.required],
      comment: ['', Validators.required],
      stars: 5
    });

    // 1) GET SINGLE ITEM FROM BACKEND (like getBusiness in FE17)
    this.webService.getfood(id)
      .subscribe((response: any) => {
        // backend returns one document
        this.food_list = [response];

        // extract coordinates (same pattern as BizFE)
        this.food_lat = this.food_list[0].location.coordinates[0];
        this.food_lng = this.food_list[0].location.coordinates[1];

        // MAP SETUP
        this.map_locations = [{
          lat: this.food_lat,
          lng: this.food_lng
        }];

        this.map_options = {
          mapId: 'DEMO_MAP_ID',
          center: { lat: this.food_lat, lng: this.food_lng },
          zoom: 13
        };

        this.webService.getLoremIpsum(1)
   .subscribe( ( response: any) => {
    this.loremIpsum = response.text.slice(0,400);
    });

        // LOREM IPSUM (from FoodData / API Ninjas)
        this.foodData.getLoremIpsum(1)
          .subscribe((res: any) => {
            this.loremIpsum = res.text.slice(0, 400);
          });

          this.webService.getLoremIpsum(
      +(this.route.snapshot.paramMap.get('id') || '0')).subscribe(
        (response:any)=>{this.reviews_list=response}
      );
    

        // WEATHER (OpenWeather via FoodData)
        this.foodData.getCurrentWeather(this.food_lat!, this.food_lng!)
          .subscribe((res: any) => {
            const desc = res.weather[0].description;
            this.temperature = Math.round(res.main.temp);

            this.weather = desc[0].toUpperCase() + desc.slice(1);
            const icon = res.weather[0].icon;
            this.weatherIconURL = `http://openweathermap.org/img/wn/${icon}@4x.png`;
            this.temperatureColour =this.foodData.getTemperatureColour(this.temperature!);
          });
      });

    // 2) GET REVIEWS FROM BACKEND (like FE17 getReviews)
    this.webService.getReviews(id)
      .subscribe((response: any) => {
        this.reviews_list = response;
      });
  }

  // submit review
  onSubmit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.webService.postReview(id, this.reviewForm.value)
      .subscribe(() => {
        this.reviewForm.reset();

        // reload updated reviews list
        this.webService.getReviews(id)
          .subscribe((response: any) => {
            this.reviews_list = response;
          });
      });
  }

  isInvalid(control: string) {
    return this.reviewForm.controls[control].invalid &&
           this.reviewForm.controls[control].touched;
  }

  isUntouched() {
    return this.reviewForm.controls.username.pristine &&
           this.reviewForm.controls.comment.pristine;
  }
}
