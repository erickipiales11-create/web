import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  user: any = null;
  medicamentosCount = 0;
  farmaciasCount = 0;
  loading = true;

  constructor(
    private api: ApiService,
    private router: Router
  ) {
    const userData = localStorage.getItem('user');
    this.user = userData ? JSON.parse(userData) : null;
  }

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.api.getMedicamentos().subscribe({
      next: (data) => {
        this.medicamentosCount = data.length;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

    this.api.getFarmacias().subscribe({
      next: (data) => {
        this.farmaciasCount = data.length;
      },
      error: () => {}
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
