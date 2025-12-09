import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {

  form = {
    username: "",
    email: "",
    password: "",
    confirm: ""
  };

  signUp() {
    if (this.form.password !== this.form.confirm) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Signup Data:", this.form);
    alert("Account created successfully!");

    this.form = { username: "", email: "", password: "", confirm: "" };
  }
}
