import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Prescripcion } from '../../models/prescripcion.model';

@Component({
  selector: 'app-prescripciones-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prescripciones-lista.html',
  styleUrl: './prescripciones-lista.css'
})
export class PrescripcionesListaComponent implements OnInit {
  prescripciones: Prescripcion[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.cargarPrescripciones();
  }

  cargarPrescripciones(): void {
    this.loading = true;
    this.api.getPrescripciones().subscribe({
      next: (data) => {
        this.prescripciones = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar prescripciones';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
