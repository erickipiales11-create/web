import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { MedicamentosListaComponent } from './components/medicamentos-lista/medicamentos-lista';
import { MedicamentosFormComponent } from './components/medicamentos-form/medicamentos-form';
import { FarmaciasListaComponent } from './components/farmacias-lista/farmacias-lista';
import { FarmaciasFormComponent } from './components/farmacias-form/farmacias-form';
import { CategoriasListaComponent } from './components/categorias-lista/categorias-lista';
import { MovimientosListaComponent } from './components/movimientos-lista/movimientos-lista';
import { PrescripcionesListaComponent } from './components/prescripciones-lista/prescripciones-lista';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'medicamentos', component: MedicamentosListaComponent, canActivate: [AuthGuard] },
  { path: 'medicamentos/nuevo', component: MedicamentosFormComponent, canActivate: [AuthGuard] },
  { path: 'medicamentos/editar/:id', component: MedicamentosFormComponent, canActivate: [AuthGuard] },
  { path: 'farmacias', component: FarmaciasListaComponent, canActivate: [AuthGuard] },
  { path: 'farmacias/nuevo', component: FarmaciasFormComponent, canActivate: [AuthGuard] },
  { path: 'farmacias/editar/:id', component: FarmaciasFormComponent, canActivate: [AuthGuard] },
  { path: 'categorias', component: CategoriasListaComponent, canActivate: [AuthGuard] },
  { path: 'movimientos', component: MovimientosListaComponent, canActivate: [AuthGuard] },
  { path: 'prescripciones', component: PrescripcionesListaComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
