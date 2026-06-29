import { Routes } from '@angular/router';
import { LoginComponent } from './features/iam/pages/login/login.component';
import { RegisterComponent } from './features/iam/pages/register/register.component';
import { RecoverPasswordComponent } from './features/iam/pages/recover-password/recover-password.component';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { DashboardComponent } from './features/analytics/pages/dashboard/dashboard.component';
import { CustomersComponent } from './features/catalog/pages/customers/customers.component';
import { VehiclesComponent } from './features/catalog/pages/vehicles/vehicles.component';
import { SimulationWizardComponent } from './features/simulation/pages/simulation-wizard/simulation-wizard.component';
import { HistoryComponent } from './features/simulation/pages/history/history.component';
import { SettingsComponent } from './features/settings/pages/settings/settings.component';
import { authGuard } from './core/guards/auth.guard';


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
      { path: 'simulaciones', component: SimulationWizardComponent },
      { path: 'historial', component: HistoryComponent },
      { path: 'configuracion', component: SettingsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
