import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Authbutton } from '../authbutton/authbutton';
import { Authuser } from '../authuser/authuser';  

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, Authbutton,Authuser],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent { }
