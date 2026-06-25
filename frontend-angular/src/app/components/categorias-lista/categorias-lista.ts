import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Categoria } from '../../models/categoria.model';

@Component({
  selector: 'app-categorias-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categorias-lista.html',
  styleUrl: './categorias-lista.css'
})
export class CategoriasListaComponent implements OnInit {
  categorias: Categoria[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.loading = true;
    this.api.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar categorías';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
