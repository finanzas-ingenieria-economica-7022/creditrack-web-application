import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnalyticsService, DashboardMetrics } from '../../services/analytics.service';

interface RecentSimulation {
  cliente: string;
  vehiculo: string;
  monto: string;
  tir: string;
  estado: 'COMPLETADA' | 'EN PROCESO' | 'RECHAZADA';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <!-- KPI Metric Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- SIMULACIONES HOY -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-6 flex justify-between items-start">
          <div class="space-y-2">
            <span class="text-xs font-semibold text-gray-500 tracking-wider uppercase">Simulaciones Hoy</span>
            <div class="text-3xl font-bold text-white">{{ todaySimulations }}</div>
          </div>
          <div class="p-3 bg-gray-800 rounded-lg text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <!-- CLIENTES REGISTRADOS -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-6 flex justify-between items-start">
          <div class="space-y-2">
            <span class="text-xs font-semibold text-gray-500 tracking-wider uppercase">Clientes Registrados</span>
            <div class="text-3xl font-bold text-white">{{ registeredClients }}</div>
          </div>
          <div class="p-3 bg-gray-800 rounded-lg text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>

        <!-- MONTO SIMULADO (MES) -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-6 flex justify-between items-start">
          <div class="space-y-2">
            <span class="text-xs font-semibold text-gray-500 tracking-wider uppercase">Monto Simulado (Mes)</span>
            <div class="text-3xl font-bold text-white">{{ monthlySimulatedAmount }}</div>
          </div>
          <div class="p-3 bg-gray-800 rounded-lg text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        </div>

        <!-- TIR PROMEDIO -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-6 flex justify-between items-start">
          <div class="space-y-2">
            <span class="text-xs font-semibold text-gray-500 tracking-wider uppercase">Tir Promedio</span>
            <div class="text-3xl font-bold text-accent-gold">{{ averageTir }}</div>
            <div class="text-[10px] text-gray-500 font-medium">promedio mensual</div>
          </div>
          <div class="p-3 bg-yellow-950/20 border border-yellow-600/20 rounded-lg text-accent-gold">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Main Layout Details Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Simulations Table (Left) -->
        <div class="lg:col-span-2 bg-dark-card border border-dark-border rounded-xl p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-white font-bold text-base">Simulaciones recientes</h3>
            <a routerLink="/historial" class="text-xs text-gray-400 hover:text-white border border-dark-border rounded-lg px-3 py-1.5 hover:bg-gray-800 transition duration-150">
              Ver historial &rarr;
            </a>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-dark-border text-gray-500 text-[10px] uppercase font-bold tracking-wider">
                  <th class="pb-3">Cliente</th>
                  <th class="pb-3">Vehículo</th>
                  <th class="pb-3">Monto</th>
                  <th class="pb-3 text-center">TIR</th>
                  <th class="pb-3 text-right">Estado</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-dark-border text-sm text-gray-300">
                <tr *ngFor="let sim of recentSimulations" class="hover:bg-gray-800/20">
                  <td class="py-4 font-medium text-white">{{ sim.cliente }}</td>
                  <td class="py-4">{{ sim.vehiculo }}</td>
                  <td class="py-4">{{ sim.monto }}</td>
                  <td class="py-4 text-center text-accent-gold font-medium">{{ sim.tir }}</td>
                  <td class="py-4 text-right">
                    <span
                      class="inline-block px-2.5 py-1 rounded text-[10px] font-bold tracking-wider"
                      [ngClass]="{
                        'bg-status-completed-bg text-status-completed-text': sim.estado === 'COMPLETADA',
                        'bg-status-process-bg text-status-process-text': sim.estado === 'EN PROCESO',
                        'bg-status-rejected-bg text-status-rejected-text': sim.estado === 'RECHAZADA'
                      }"
                    >
                      {{ sim.estado }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Quick Access (Right) -->
        <div class="space-y-6">
          <h3 class="text-white font-bold text-base mb-1">Acceso Rápido</h3>

          <!-- Card 1: Nuevo cliente -->
          <a
            routerLink="/clientes"
            class="flex items-center justify-between p-5 bg-dark-card border border-dark-border hover:border-gray-700 rounded-xl cursor-pointer transition duration-150 group"
          >
            <div>
              <h4 class="text-white font-bold text-sm">Nuevo cliente</h4>
              <p class="text-xs text-gray-500 mt-1">Registrar perfil en sistema</p>
            </div>
            <div class="text-gray-400 group-hover:text-white transition duration-150">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </a>

          <!-- Card 2: Registrar vehículo -->
          <a
            routerLink="/vehiculos"
            class="flex items-center justify-between p-5 bg-dark-card border border-dark-border hover:border-gray-700 rounded-xl cursor-pointer transition duration-150 group"
          >
            <div>
              <h4 class="text-white font-bold text-sm">Registrar vehículo</h4>
              <p class="text-xs text-gray-500 mt-1">Añadir garantía a cliente</p>
            </div>
            <div class="text-gray-400 group-hover:text-white transition duration-150">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1M21 16V10a2 2 0 00-2-2h-3V6a1 1 0 00-1-1H13m8 11h1a1 1 0 001-1v-4a1 1 0 00-1-1h-1m-1 5a2 2 0 10-4 0M7 16a2 2 0 10-4 0" />
              </svg>
            </div>
          </a>

          <!-- Card 3: Nueva simulación (Highlighted in vibrant blue) -->
          <a
            routerLink="/simulaciones"
            class="flex items-center justify-between p-5 bg-brand-primary hover:bg-brand-hover border border-brand-primary rounded-xl cursor-pointer transition duration-150 group"
          >
            <div>
              <h4 class="text-white font-bold text-sm">Nueva simulación</h4>
              <p class="text-xs text-blue-200 mt-1">Calcular escenario crediticio</p>
            </div>
            <div class="text-white/80 group-hover:text-white transition duration-150">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  todaySimulations: string = '08';
  registeredClients: string = '124';
  monthlySimulatedAmount: string = 'S/ 4,280,500';
  averageTir: string = '16.2%';

  recentSimulations: RecentSimulation[] = [
    { cliente: 'Mateo Rojas', vehiculo: 'Toyota Yaris 2024', monto: 'S/ 48,000', tir: '16.08%', estado: 'COMPLETADA' },
    { cliente: 'Sofía Castro', vehiculo: 'Kia Sportage', monto: 'USD 22,500', tir: '12.68%', estado: 'COMPLETADA' },
    { cliente: 'Luis Vargas', vehiculo: 'Hyundai Tucson', monto: 'S/ 85,000', tir: '15.20%', estado: 'EN PROCESO' },
    { cliente: 'Ana Mendoza', vehiculo: 'Nissan Versa', monto: 'S/ 52,000', tir: '13.50%', estado: 'RECHAZADA' }
  ];

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    this.analyticsService.getDashboardMetrics().subscribe({
      next: (metrics: DashboardMetrics) => {
        // Sync values from backend if they are available
        if (metrics.totalSimulations !== undefined && metrics.totalSimulations > 0) {
          // Add pad for today simulations (mock calculation based on actual stats)
          this.todaySimulations = String(metrics.totalSimulations).padStart(2, '0');
          // Format average loan amount total
          const totalAmount = metrics.averageLoanAmount * metrics.totalSimulations;
          this.monthlySimulatedAmount = 'S/ ' + new Intl.NumberFormat('es-PE').format(Math.round(totalAmount));
          // Annualized TCEA / monthly TIR formatting
          this.averageTir = (metrics.averageTcea * 100).toFixed(1) + '%';
        }
      },
      error: () => {
        // Fallback default mockup states are already configured
      }
    });
  }
}
