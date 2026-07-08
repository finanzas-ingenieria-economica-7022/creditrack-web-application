import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { catchError, of } from 'rxjs';
import { AnalyticsService, DashboardMetrics } from '../../services/analytics.service';
import { SimulationService } from '../../../../core/services/simulation.service';
import { CustomerService } from '../../../../core/services/customer.service';
import { VehicleService } from '../../../../core/services/vehicle.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <!-- KPI Metric Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- SIMULACIONES TOTALES -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-6 flex justify-between items-start">
          <div class="space-y-2">
            <span class="text-xs font-semibold text-gray-500 tracking-wider uppercase">Simulaciones</span>
            <div class="text-3xl font-bold text-white">
              <span *ngIf="loading" class="inline-block w-10 h-8 bg-gray-800 rounded animate-pulse"></span>
              <span *ngIf="!loading">{{ totalSimulationsDisplay }}</span>
            </div>
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
            <div class="text-3xl font-bold text-white">
              <span *ngIf="loading" class="inline-block w-10 h-8 bg-gray-800 rounded animate-pulse"></span>
              <span *ngIf="!loading">{{ registeredClientsDisplay }}</span>
            </div>
          </div>
          <div class="p-3 bg-gray-800 rounded-lg text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>

        <!-- MONTO PROMEDIO -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-6 flex justify-between items-start">
          <div class="space-y-2">
            <span class="text-xs font-semibold text-gray-500 tracking-wider uppercase">Monto Promedio</span>
            <div class="text-3xl font-bold text-white">
              <span *ngIf="loading" class="inline-block w-24 h-8 bg-gray-800 rounded animate-pulse"></span>
              <span *ngIf="!loading">{{ avgLoanAmountDisplay }}</span>
            </div>
          </div>
          <div class="p-3 bg-gray-800 rounded-lg text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        </div>

        <!-- TCEA PROMEDIO -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-6 flex justify-between items-start">
          <div class="space-y-2">
            <span class="text-xs font-semibold text-gray-500 tracking-wider uppercase">TCEA Promedio</span>
            <div class="text-3xl font-bold text-accent-gold">
              <span *ngIf="loading" class="inline-block w-16 h-8 bg-gray-800 rounded animate-pulse"></span>
              <span *ngIf="!loading">{{ avgTceaDisplay }}</span>
            </div>
            <div class="text-[10px] text-gray-500 font-medium">costo efectivo anual</div>
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

          <!-- Loading skeleton -->
          <div *ngIf="loading" class="space-y-3">
            <div *ngFor="let i of [1,2,3,4]" class="h-10 bg-gray-800/60 rounded animate-pulse"></div>
          </div>

          <!-- Empty state -->
          <div *ngIf="!loading && recentSimulations.length === 0" class="flex flex-col items-center justify-center py-10 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p class="text-gray-500 text-sm font-medium">Sin simulaciones aun</p>
            <p class="text-gray-600 text-xs mt-1">Crea una simulacion para verla aqui</p>
          </div>

          <div *ngIf="!loading && recentSimulations.length > 0" class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-dark-border text-gray-500 text-[10px] uppercase font-bold tracking-wider">
                  <th class="pb-3">Cliente</th>
                  <th class="pb-3">Vehiculo</th>
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
        <div class="space-y-4">
          <h3 class="text-white font-bold text-base mb-1">Acceso Rapido</h3>

          <!-- Card 1: Nuevo cliente -->
          <a
            id="quick-access-new-client"
            routerLink="/clientes"
            [queryParams]="{openModal: 'true'}"
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

          <!-- Card 2: Registrar vehiculo -->
          <a
            id="quick-access-new-vehicle"
            routerLink="/vehiculos"
            [queryParams]="{openModal: 'true'}"
            class="flex items-center justify-between p-5 bg-dark-card border border-dark-border hover:border-gray-700 rounded-xl cursor-pointer transition duration-150 group"
          >
            <div>
              <h4 class="text-white font-bold text-sm">Registrar vehiculo</h4>
              <p class="text-xs text-gray-500 mt-1">Anadir garantia a cliente</p>
            </div>
            <div class="text-gray-400 group-hover:text-white transition duration-150">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1M21 16V10a2 2 0 00-2-2h-3V6a1 1 0 00-1-1H13m8 11h1a1 1 0 001-1v-4a1 1 0 00-1-1h-1m-1 5a2 2 0 10-4 0M7 16a2 2 0 10-4 0" />
              </svg>
            </div>
          </a>

          <!-- Card 3: Nueva simulacion (Highlighted in vibrant blue) -->
          <a
            id="quick-access-new-simulation"
            routerLink="/simulaciones"
            class="flex items-center justify-between p-5 bg-brand-primary hover:bg-brand-hover border border-brand-primary rounded-xl cursor-pointer transition duration-150 group"
          >
            <div>
              <h4 class="text-white font-bold text-sm">Nueva simulacion</h4>
              <p class="text-xs text-blue-200 mt-1">Calcular escenario crediticio</p>
            </div>
            <div class="text-white/80 group-hover:text-white transition duration-150">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  loading = true;

  totalSimulationsDisplay = '00';
  registeredClientsDisplay = '00';
  avgLoanAmountDisplay = '—';
  avgTceaDisplay = '—';

  recentSimulations: {
    cliente: string;
    vehiculo: string;
    monto: string;
    tir: string;
    estado: 'COMPLETADA' | 'EN PROCESO' | 'RECHAZADA';
  }[] = [];

  private customerMap: Record<number, string> = {};
  private vehicleMap: Record<number, string> = {};

  constructor(
    private analyticsService: AnalyticsService,
    private simulationService: SimulationService,
    private customerService: CustomerService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit() {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    this.loading = true;

    forkJoin({
      metrics: this.analyticsService.getDashboardMetrics().pipe(catchError(() => of(null))),
      simulations: this.simulationService.getAll().pipe(catchError(() => of([]))),
      customers: this.customerService.getAll().pipe(catchError(() => of([]))),
      vehicles: this.vehicleService.getAll().pipe(catchError(() => of([])))
    }).subscribe(({ metrics, simulations, customers, vehicles }) => {
      // Build lookup maps
      (customers as any[]).forEach((c: any) => {
        this.customerMap[c.id] = `${c.firstName} ${c.lastName}`;
      });
      (vehicles as any[]).forEach((v: any) => {
        this.vehicleMap[v.id] = `${v.brand} ${v.model}`;
      });

      // KPI Cards
      const totalSims = (simulations as any[]).length;
      this.totalSimulationsDisplay = String(totalSims).padStart(2, '0');
      this.registeredClientsDisplay = String((customers as any[]).length).padStart(2, '0');

      if (metrics && (metrics as DashboardMetrics).averageLoanAmount > 0) {
        const m = metrics as DashboardMetrics;
        this.avgLoanAmountDisplay = 'S/ ' + new Intl.NumberFormat('es-PE', { maximumFractionDigits: 0 }).format(m.averageLoanAmount);
        // TCEA from metrics DB is now stored as percentage (e.g., 14.0)
        this.avgTceaDisplay = Number(m.averageTcea).toFixed(1) + '%';
      } else if (totalSims > 0) {
        const totalLoan = (simulations as any[]).reduce((sum: number, s: any) => sum + (s.financedAmount || 0), 0);
        const totalTcea = (simulations as any[]).reduce((sum: number, s: any) => sum + (s.tceaPercent || 0), 0);
        this.avgLoanAmountDisplay = 'S/ ' + new Intl.NumberFormat('es-PE', { maximumFractionDigits: 0 }).format(totalLoan / totalSims);
        this.avgTceaDisplay = (totalTcea / totalSims).toFixed(1) + '%';
      } else {
        this.avgLoanAmountDisplay = 'S/ 0';
        this.avgTceaDisplay = '0.0%';
      }

      // Recent simulations (last 5 sorted by id desc)
      const sorted = [...(simulations as any[])].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 5);
      this.recentSimulations = sorted.map((s: any) => {
        const isSoles = s.currency === 'PEN';
        const sym = isSoles ? 'S/' : 'USD';
        const tirPct = s.tirPercent != null ? Number(s.tirPercent).toFixed(2) + '%' : '—';
        const monto = sym + ' ' + new Intl.NumberFormat('es-PE', { maximumFractionDigits: 0 }).format(s.financedAmount || s.vehiclePrice || 0);
        return {
          cliente: this.customerMap[s.clientId] || `Cliente #${s.clientId}`,
          vehiculo: this.vehicleMap[s.vehicleId] || `Vehiculo #${s.vehicleId}`,
          monto,
          tir: tirPct,
          estado: 'COMPLETADA' as const
        };
      });

      this.loading = false;
    });
  }
}
