import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Farmacia } from '../../models/farmacia.model';

@Component({
  selector: 'app-farmacias-lista',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './farmacias-lista.html',
  styleUrl: './farmacias-lista.css'
})
export class FarmaciasListaComponent implements OnInit {
  farmacias: Farmacia[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.cargarFarmacias();
  }

  cargarFarmacias(): void {
    this.loading = true;
    this.api.getFarmacias().subscribe({
      next: (data) => {
        this.farmacias = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar farmacias';
        this.loading = false;
        console.error(err);
      }
    });
  }

  eliminarFarmacia(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta farmacia?')) {
      this.api.deleteFarmacia(id).subscribe({
        next: () => this.cargarFarmacias(),
        error: (err) => {
          alert('Error al eliminar la farmacia');
          console.error(err);
        }
      });
    }
  }
}
