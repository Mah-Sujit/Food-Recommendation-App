import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { FoodData } from '../../services/food-data';
import { WebServices } from '../../services/web-service';

export interface Food {
  _id: string;
  name: string;
  rating: number;
  city?: string;
  country?: string;
  image?: string;
  lat?: number;
  lng?: number;
}


@Component({
  selector: 'app-food',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, ReactiveFormsModule],
  providers: [WebServices, FoodData],
  templateUrl: './food.html',
  styleUrls: ['./food.css'],
})

export class Food {

  food_list: any = [];
  reviews_list: any = [];

  food_lat: number = 0;
  food_lng: number = 0;
  map_options: google.maps.MapOptions = {};
  map_locations: any[] = [];

  loremIpsum: string = '';
  weatherIconURL: string = '';
  temperature: number = 0;
  temperatureColour: string = '';
  weather: string = '';
  reviewForm: any;
  

  constructor(
    private route: ActivatedRoute,
    private webService: WebServices,
    private foodData: FoodData,
    private fb: FormBuilder,
    protected authService: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    // Build review form
    this.reviewForm = this.fb.group({
      username: ['', Validators.required],
      comment: ['', Validators.required],
      stars: [5, Validators.required]
    });

    // GET SINGLE FOOD DOCUMENT
    this.webService.getfood(id).subscribe((food: any) => {
      this.food_list = [food];

      // CORRECT STRUCTURE (your MongoDB)
        this.food_lat = food.Location.Coordinates.Latitude;
        this.food_lng = food.Location.Coordinates.Longitude;

      this.reviews_list = food.CustomerReviews || [];

      // Google Map settings
      this.map_options = {
        mapId:"DEMO_MAP_ID",
        center: { lat: this.food_lat, lng: this.food_lng },
        zoom: 13
      };
      this.map_locations = [
        { lat: this.food_lat, lng: this.food_lng }
      ];

      // WEATHER API
      this.foodData.getCurrentWeather(this.food_lat, this.food_lng)
        .subscribe((res: any) => {
          const desc = res.weather[0].description;
          this.temperature = Math.round(res.main.temp);
          this.weather = desc[0].toUpperCase() + desc.slice(1);

          const icon = res.weather[0].icon;
          this.weatherIconURL = `http://openweathermap.org/img/wn/${icon}@4x.png`;

          this.temperatureColour = this.foodData.getTemperatureColour(this.temperature);
        });

      // Description text
      this.webService.getLoremIpsum(1).subscribe((res: any) => {
        this.loremIpsum = res.text.slice(0, 400);
      });
      this.foodData.getLoremIpsum(1) .subscribe((response: any) => { console.log(response.text); });

    });
  }

  // Submit review
  onSubmit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.webService.postReview(id, this.reviewForm.value).subscribe(() => {
      this.reviewForm.reset();

      // Refresh food to reload reviews
      this.webService.getfood(id).subscribe((food: any) => {
        this.reviews_list = food.CustomerReviews;
      });
    });
  }

  isInvalid(control: string) {
    return (
      this.reviewForm.controls[control].invalid &&
      this.reviewForm.controls[control].touched
    );
  }
}
