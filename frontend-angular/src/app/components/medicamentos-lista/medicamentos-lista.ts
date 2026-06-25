import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-medicamentos-lista',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './medicamentos-lista.html',
  styleUrl: './medicamentos-lista.css'
})
export class MedicamentosListaComponent implements OnInit {
  medicamentos: any[] = [];
  loading = true;  // 🔥 Empieza en true
  error = '';

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.cargarMedicamentos();
  }

  cargarMedicamentos(): void {
    this.loading = true;
    this.error = '';
    console.log('🔄 Cargando medicamentos...');

    const token = localStorage.getItem('token');
    
    fetch('http://localhost:3000/api/medicamentos', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      console.log('📡 Respuesta:', res.status);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log('✅ Medicamentos:', data);
      this.medicamentos = data || [];
      this.loading = false;
      // 🔥 FORZAR ACTUALIZACIÓN DE LA VISTA
      this.cdr.detectChanges();
      console.log('📊 Total:', this.medicamentos.length, 'loading:', this.loading);
    })
    .catch(err => {
      console.error('❌ Error:', err);
      this.error = 'Error al cargar medicamentos';
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  eliminarMedicamento(id: number): void {
    if (confirm('¿Estás seguro de eliminar este medicamento?')) {
      const token = localStorage.getItem('token');
      
      fetch(`http://localhost:3000/api/medicamentos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then(() => {
        console.log('✅ Eliminado');
        this.cargarMedicamentos();
      })
      .catch(err => {
        console.error('❌ Error:', err);
        alert('Error al eliminar');
      });
    }
  }
}
