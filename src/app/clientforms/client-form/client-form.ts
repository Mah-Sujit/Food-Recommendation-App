import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-client-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './client-form.html',
  styleUrls: ['./client-form.css']
})
export class ClientFormComponent {
  user = {
    username: '',
    email: '',
    password: ''
  };

  save() {
    console.log("Saving client form:", this.user);
  }
}
