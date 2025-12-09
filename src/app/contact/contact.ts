import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact {

  form = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    country: "",
    industry: "",
    employees: "",
    usage: "",
    message: ""
  };

  submitForm() {
    console.log("Contact Form Submitted:", this.form);

    alert("Thanks for contacting us! We'll reply soon.");

    // Reset properly:
    Object.keys(this.form).forEach(key => {
     this.form[key as keyof typeof this.form] = "";
  });
}
}
