import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Movimiento } from '../../models/movimiento.model';

@Component({
  selector: 'app-movimientos-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movimientos-lista.html',
  styleUrl: './movimientos-lista.css'
})
export class MovimientosListaComponent implements OnInit {
  movimientos: Movimiento[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.cargarMovimientos();
  }

  cargarMovimientos(): void {
    this.loading = true;
    this.api.getMovimientos().subscribe({
      next: (data) => {
        this.movimientos = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar movimientos';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
