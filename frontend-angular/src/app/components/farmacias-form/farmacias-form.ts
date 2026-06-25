import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Farmacia } from '../../models/farmacia.model';

@Component({
  selector: 'app-farmacias-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './farmacias-form.html',
  styleUrl: './farmacias-form.css'
})
export class FarmaciasFormComponent implements OnInit {
  farmacia: Farmacia = {
    nombre: '',
    direccion: '',
    telefono: '',
    email: ''
  };
  isEdit = false;
  id = 0;
  loading = false;
  error = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.isEdit = true;
      this.cargarFarmacia();
    }
  }

  cargarFarmacia(): void {
    this.api.getFarmacia(this.id).subscribe({
      next: (data) => {
        this.farmacia = data;
      },
      error: (err) => {
        this.error = 'Error al cargar la farmacia';
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.error = '';

    if (this.isEdit) {
      this.api.updateFarmacia(this.id, this.farmacia).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/farmacias']);
        },
        error: (err) => {
          this.error = 'Error al actualizar la farmacia';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      this.api.createFarmacia(this.farmacia).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/farmacias']);
        },
        error: (err) => {
          this.error = 'Error al crear la farmacia';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }
}
