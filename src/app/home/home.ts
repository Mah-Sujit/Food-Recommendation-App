import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  
  message = signal('Hello! Welcome to Food App.');

  changeMessage() {
    this.message.set('Enjoy delicious food!');
  }
}
