import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-clients',
  imports: [CommonModule],
  templateUrl: './clients.html',
  styleUrls: ['./clients.css']
})
export class ClientsComponent {
  clients = [
    { username: 'john', email: 'john@gmail.com' },
    { username: 'alice', email: 'alice@yahoo.com' }
  ];
}
