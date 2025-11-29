import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Authbutton } from '..//authbutton/authbutton';
import { Authuser } from '..//authuser/authuser';  
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, Authbutton,Authuser,CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  isDark = false;

toggleDarkMode() {
  this.isDark = !this.isDark;
  document.body.classList.toggle('dark-mode', this.isDark);
}
ngAfterViewInit() {
  const elements = document.querySelectorAll('.scroll-animate');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-show');
      }
    });
  });

  elements.forEach(el => observer.observe(el));
}



 }
