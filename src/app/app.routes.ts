import { Routes } from '@angular/router';
import { LoginComponent } from './features/iam/pages/login/login.component';
import { RegisterComponent } from './features/iam/pages/register/register.component';
import { RecoverPasswordComponent } from './features/iam/pages/recover-password/recover-password.component';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { DashboardComponent } from './features/analytics/pages/dashboard/dashboard.component';
import { CustomersComponent } from './features/catalog/pages/customers/customers.component';
import { VehiclesComponent } from './features/catalog/pages/vehicles/vehicles.component';
import { authGuard } from './core/guards/auth.guard';
import { Component } from '@angular/core';

// Inline placeholder for features implemented in subsequent iterations
@Component({
  standalone: true,
  template: `
    <div class="bg-dark-card border border-dark-border rounded-xl p-8 max-w-2xl mx-auto text-center mt-12">
      <div class="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-primary">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      </div>
      <h2 class="text-white font-bold text-xl mb-2">Sección en Construcción</h2>
      <p class="text-gray-400 text-sm">Esta vista será implementada en las siguientes iteraciones del plan de trabajo.</p>
    </div>
  `
})
export class PlaceholderComponent {}

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'recover-password', component: RecoverPasswordComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'clientes', component: CustomersComponent },
      { path: 'vehiculos', component: VehiclesComponent },
      { path: 'simulaciones', component: PlaceholderComponent },
      { path: 'historial', component: PlaceholderComponent },
      { path: 'configuracion', component: PlaceholderComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
