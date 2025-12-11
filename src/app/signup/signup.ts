import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiAuthService } from '../services/auth-service';
import { Router } from '@angular/router';

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
    confirm: "",};
  toastMessage: string = "";
  toastVisible: boolean = false;
  toastSuccess: boolean = false;

 constructor(
    private apiAuth: ApiAuthService,   // Inject API service
    private router: Router             // <-- FIXED: Router added
  ) {}

showToast(msg: string, success = false) {
  this.toastMessage = msg;
  this.toastSuccess = success;
  this.toastVisible = true;

  setTimeout(() => {
    this.toastVisible = false;
  }, 2500);
}

signUp() {
  const { username, email, password, confirm } = this.form;

  if (!username || !email || !password || !confirm) {
    this.showToast("Please fill all fields.");
    return;
  }

  if (!email.includes("@")) {
    this.showToast("Invalid email format.");
    return;
  }

  if (password.length < 6) {
    this.showToast("Password must be at least 6 characters.");
    return;
  }

  if (password !== confirm) {
    this.showToast("Passwords do not match.");
    return;
  }

  this.apiAuth.signup(this.form).subscribe({
    next: () => {
      this.showToast("Signup successful!", true);
      this.router.navigate(['/login']);
    },
    error: (err:any) => {
      this.showToast(err.error?.message || "Signup failed.");
    }
  });
}
}
