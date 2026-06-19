import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {

  api = inject(ApiService);

  medicines: any[] = [];

  ngOnInit() {
    this.api.getMedicines().subscribe({
      next: (data: any) => {
        this.medicines = data;
        console.log(data);
      },
      error: (err) => console.error(err)
    });
  }
}