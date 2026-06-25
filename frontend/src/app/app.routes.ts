import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MedicamentosListaComponent } from './components/medicamentos-lista/medicamentos-lista.component';
import { MedicamentosFormComponent } from './components/medicamentos-form/medicamentos-form.component';
import { FarmaciasListaComponent } from './components/farmacias-lista/farmacias-lista.component';
import { FarmaciasFormComponent } from './components/farmacias-form/farmacias-form.component';
import { CategoriasListaComponent } from './components/categorias-lista/categorias-lista.component';
import { MovimientosListaComponent } from './components/movimientos-lista/movimientos-lista.component';
import { PrescripcionesListaComponent } from './components/prescripciones-lista/prescripciones-lista.component';

export const routes: Routes = [
  // Rutas públicas
  { path: 'login', component: LoginComponent },
  
  // Rutas protegidas (requieren autenticación)
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  
  // CRUD Medicamentos
  { path: 'medicamentos', component: MedicamentosListaComponent, canActivate: [AuthGuard] },
  { path: 'medicamentos/nuevo', component: MedicamentosFormComponent, canActivate: [AuthGuard] },
  { path: 'medicamentos/editar/:id', component: MedicamentosFormComponent, canActivate: [AuthGuard] },
  
  // CRUD Farmacias
  { path: 'farmacias', component: FarmaciasListaComponent, canActivate: [AuthGuard] },
  { path: 'farmacias/nuevo', component: FarmaciasFormComponent, canActivate: [AuthGuard] },
  { path: 'farmacias/editar/:id', component: FarmaciasFormComponent, canActivate: [AuthGuard] },
  
  // CRUD Categorías
  { path: 'categorias', component: CategoriasListaComponent, canActivate: [AuthGuard] },
  
  // Movimientos
  { path: 'movimientos', component: MovimientosListaComponent, canActivate: [AuthGuard] },
  
  // Prescripciones
  { path: 'prescripciones', component: PrescripcionesListaComponent, canActivate: [AuthGuard] },
  
  // Redirecciones
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];