import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-medicamentos-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medicamentos-form.html',
  styleUrl: './medicamentos-form.css'
})
export class MedicamentosFormComponent implements OnInit {
  medicamento: any = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoriaId: null,
    farmaciaId: null
  };
  isEdit = false;
  id = 0;
  loading = false;
  error = '';
  categorias: any[] = [];
  farmacias: any[] = [];

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cargarCategoriasYFarmacias();
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.isEdit = true;
      this.cargarMedicamento();
    }
  }

  cargarCategoriasYFarmacias(): void {
    // Cargar categorías
    this.api.getCategorias().subscribe({
      next: (data) => {
        console.log('Categorías cargadas:', data);
        this.categorias = Array.isArray(data) ? data : [];
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.categorias = [];
      }
    });

    // Cargar farmacias
    this.api.getFarmacias().subscribe({
      next: (data) => {
        console.log('Farmacias cargadas:', data);
        this.farmacias = Array.isArray(data) ? data : [];
      },
      error: (err) => {
        console.error('Error al cargar farmacias:', err);
        this.farmacias = [];
      }
    });
  }

  cargarMedicamento(): void {
    this.api.getMedicamento(this.id).subscribe({
      next: (data) => {
        this.medicamento = data;
      },
      error: (err) => {
        this.error = 'Error al cargar el medicamento';
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.error = '';

    const datos = {
      nombre: this.medicamento.nombre,
      descripcion: this.medicamento.descripcion || '',
      precio: Number(this.medicamento.precio),
      stock: Number(this.medicamento.stock),
      categoriaId: Number(this.medicamento.categoriaId),
      farmaciaId: Number(this.medicamento.farmaciaId)
    };

    if (this.isEdit) {
      this.api.updateMedicamento(this.id, datos).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/medicamentos']);
        },
        error: (err) => {
          this.error = 'Error al actualizar el medicamento';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      this.api.createMedicamento(datos).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/medicamentos']);
        },
        error: (err) => {
          this.error = 'Error al crear el medicamento';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }
}
