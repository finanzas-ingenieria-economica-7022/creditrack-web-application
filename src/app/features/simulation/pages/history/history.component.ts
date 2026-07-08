import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SimulationService } from '../../../../core/services/simulation.service';
import { CustomerService, Customer } from '../../../../core/services/customer.service';
import { VehicleService, Vehicle } from '../../../../core/services/vehicle.service';

interface SimulationItem {
  id: number;
  code: string;
  clientId: number;
  vehicleId: number;
  financialEntityId?: number;
  currency: string;
  vehiclePrice: number;
  downPaymentPercent: number;
  financedAmount: number;
  termMonths: number;
  teaPercent: number;
  temPercent: number;
  cokTeaPercent?: number;
  cokTemPercent?: number;
  tirPercent: number;
  tceaPercent: number;
  van: number;
  monthlyPayment: number;
  balloonPercent: number;
  balloonAmount?: number;
  totalInterest: number;
  totalInsurance: number;
  totalFees: number;
  totalPayment: number;
  graceType: string;
  graceMonths: number;
  firstPaymentDate: string;
  createdDate: string;
  status: string;
  creditLifeInsuranceMonthlyPercent: number;
  vehicleInsuranceAnnualPercent: number;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 relative overflow-hidden">
      <!-- Title & Action Bar -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 class="text-white font-bold text-2xl tracking-wide">Historial de evaluaciones</h1>
        
        <div class="flex items-center space-x-3 w-full md:w-auto">
          <!-- Search input -->
          <div class="relative flex-1 md:w-64">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (input)="onFilter()"
              placeholder="Buscar por ID o Cliente..."
              class="w-full pl-10 pr-4 py-2.5 bg-dark-card border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary text-xs transition duration-150"
            />
          </div>

          <!-- Status Dropdown -->
          <select
            [(ngModel)]="statusFilter"
            (change)="onFilter()"
            class="px-4 py-2.5 bg-dark-card border border-dark-border rounded-lg text-white text-xs focus:outline-none focus:border-brand-primary cursor-pointer w-44"
          >
            <option value="ALL">Todos los estados</option>
            <option value="Aprobado">Aprobado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Rechazado">Rechazado</option>
          </select>

          <!-- Export Button -->
          <button
            (click)="exportCSV()"
            class="px-4 py-2.5 border border-dark-border hover:bg-gray-800 text-gray-300 font-semibold text-xs rounded-lg flex items-center space-x-1.5 transition duration-150 shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      <!-- KPI metrics row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- TOTAL SIMULACIONES -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-6 space-y-2">
          <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Simulaciones</span>
          <div class="text-2xl font-extrabold text-white">{{ filteredSimulations.length }}</div>
        </div>

        <!-- MONTO EVALUADO -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-6 space-y-2">
          <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Monto Evaluado</span>
          <div class="text-2xl font-extrabold text-white">S/ {{ formatEvaluatedAmount() }}</div>
        </div>

        <!-- TIR PROMEDIO -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-6 space-y-2">
          <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tir Promedio</span>
          <div class="text-2xl font-extrabold text-accent-gold">{{ formatAverageTir() }}%</div>
        </div>
      </div>

      <!-- Evaluations Table Card -->
      <div class="bg-dark-card border border-dark-border rounded-xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="border-b border-dark-border text-gray-500 text-[10px] uppercase font-bold tracking-wider">
                <th class="px-6 py-4">ID</th>
                <th class="px-6 py-4">Cliente</th>
                <th class="px-6 py-4">Vehículo</th>
                <th class="px-6 py-4">Moneda</th>
                <th class="px-6 py-4">Monto</th>
                <th class="px-6 py-4">Tir</th>
                <th class="px-6 py-4">Cuota Balón</th>
                <th class="px-6 py-4">Fecha</th>
                <th class="px-6 py-4">Estado</th>
                <th class="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-dark-border text-gray-300">
              <!-- Loading indicator -->
              <tr *ngIf="loading">
                <td colspan="10" class="px-6 py-12 text-center text-gray-500">
                  <div class="flex items-center justify-center space-x-2">
                    <div class="w-4 h-4 rounded-full border-2 border-brand-primary border-t-transparent animate-spin"></div>
                    <span>Cargando historial de simulaciones...</span>
                  </div>
                </td>
              </tr>

              <!-- Empty state -->
              <tr *ngIf="!loading && filteredSimulations.length === 0">
                <td colspan="10" class="px-6 py-12 text-center text-gray-500">
                  No se encontraron evaluaciones registradas.
                </td>
              </tr>

              <!-- Rows -->
              <tr *ngFor="let sim of pagedSimulations; let idx = index" class="hover:bg-gray-800/10 transition duration-100">
                <td class="px-6 py-4 font-mono text-gray-500">#SIM-{{ formatId(sim.id) }}</td>
                <td class="px-6 py-4 font-semibold text-white">{{ getCustomerName(sim.clientId) }}</td>
                <td class="px-6 py-4">{{ getVehicleName(sim.vehicleId) }}</td>
                <td class="px-6 py-4 font-mono">{{ sim.currency }}</td>
                <td class="px-6 py-4 font-bold text-white">{{ formatCurrencySymbol(sim.vehiclePrice) }} {{ formatNumber(sim.financedAmount) }}</td>
                <td class="px-6 py-4">
                  <span class="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-accent-gold/15 text-accent-gold border border-accent-gold/20">
                    {{ formatPercentageValue(sim.tirPercent) }}%
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-yellow-950/20 text-yellow-600 border border-yellow-700/25">
                    {{ formatPercentageValue(sim.balloonPercent) }}%
                  </span>
                </td>
                <td class="px-6 py-4">{{ getFormattedDate(sim.createdDate, idx) }}</td>
                <td class="px-6 py-4">
                  <span
                    class="inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider"
                    [ngClass]="getStatusClass(idx)"
                  >
                    {{ getMockStatus(idx) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right space-x-3 shrink-0">
                  <!-- Excel export -->
                  <button (click)="downloadExcel(sim); $event.stopPropagation()" class="text-gray-400 hover:text-white transition duration-150 inline-block align-middle" title="Exportar Excel">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                  <!-- PDF export -->
                  <button (click)="downloadPDF(sim); $event.stopPropagation()" class="text-gray-400 hover:text-white transition duration-150 inline-block align-middle" title="Exportar PDF">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  </button>
                  <!-- Details view -->
                  <button (click)="openDrawer(sim, idx)" class="text-gray-400 hover:text-white transition duration-150 inline-block align-middle" title="Vista Rápida">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Bar -->
        <div class="px-6 py-4 border-t border-dark-border flex items-center justify-between text-xs text-gray-500">
          <div>
            Mostrando {{ getShowingRangeText() }} de {{ filteredSimulations.length }} evaluaciones
          </div>
          <div class="flex items-center space-x-1">
            <!-- Prev -->
            <button
              [disabled]="currentPage === 1"
              (click)="changePage(currentPage - 1)"
              class="p-2 border border-dark-border hover:bg-gray-800 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <!-- Page Number buttons -->
            <button
              *ngFor="let page of getPageNumbers()"
              (click)="changePage(page)"
              class="w-8 h-8 rounded-lg border font-medium text-xs transition duration-150"
              [ngClass]="page === currentPage ? 'bg-brand-primary border-brand-primary text-white font-bold' : 'border-dark-border hover:bg-gray-800 text-gray-400'"
            >
              {{ page }}
            </button>

            <!-- Next -->
            <button
              [disabled]="currentPage === totalPages"
              (click)="changePage(currentPage + 1)"
              class="p-2 border border-dark-border hover:bg-gray-800 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Quick View Drawer (V15 Overlay) -->
      <div
        *ngIf="isDrawerOpen"
        class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        (click)="closeDrawer()"
      >
        <!-- Slide Panel -->
        <div
          class="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-dark-card border-l border-dark-border shadow-2xl p-6 flex flex-col justify-between overflow-y-auto space-y-6 animate-in slide-in-from-right duration-200"
          (click)="$event.stopPropagation()"
        >
          <!-- Drawer Header -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span
                class="px-2 py-0.5 rounded text-[9px] font-bold tracking-wider"
                [ngClass]="getStatusClass(activeDrawerIndex)"
              >
                {{ getMockStatus(activeDrawerIndex) | uppercase }}
              </span>
              <span class="text-xs text-gray-500 font-mono">TRX-{{ formatId(activeSimulation.id) }}</span>
              <button (click)="closeDrawer()" class="text-gray-500 hover:text-white transition duration-150">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <h2 class="text-white font-bold text-xl leading-none">{{ getCustomerName(activeSimulation.clientId) }}</h2>
          </div>

          <!-- Parameter grid -->
          <div class="grid grid-cols-2 gap-y-4 gap-x-2 text-xs border-b border-dark-border pb-5">
            <div>
              <span class="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Monto Solicitado</span>
              <span class="text-white font-semibold">
                {{ formatCurrencySymbol(activeSimulation.vehiclePrice) }} {{ formatNumber(activeSimulation.financedAmount) }}
              </span>
            </div>
            <div>
              <span class="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Plazo</span>
              <span class="text-white font-semibold">{{ activeSimulation.termMonths }} Meses</span>
            </div>
            <div>
              <span class="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Tasa Base Anual</span>
              <span class="text-white font-semibold">{{ formatPercentageValue(activeSimulation.teaPercent) }}%</span>
            </div>
            <div>
              <span class="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Tipo de Vehículo</span>
              <span class="text-white font-semibold">{{ getVehicleCategory(activeSimulation.vehicleId) }}</span>
            </div>
            <div>
              <span class="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Enganche</span>
              <span class="text-white font-semibold">
                {{ formatCurrencySymbol(activeSimulation.vehiclePrice) }} {{ formatNumber(calculateInitialPaymentValue()) }}
                ({{ formatPercentageValue(activeSimulation.downPaymentPercent) }}%)
              </span>
            </div>
            <div>
              <span class="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Seguro Incluido</span>
              <span class="text-white font-semibold">Multianual</span>
            </div>
          </div>

          <!-- Resultados clave container -->
          <div class="bg-dark-input/20 border border-dark-border rounded-xl p-5 space-y-4">
            <h4 class="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Resultados clave</h4>
            <div class="grid grid-cols-3 gap-3">
              <div>
                <span class="text-[9px] text-gray-500 block mb-0.5">Cuota Mensual</span>
                <span class="text-white font-bold text-sm">
                  {{ formatCurrencySymbol(activeSimulation.vehiclePrice) }} {{ formatNumber(activeDrawerFirstCuota) }}
                </span>
              </div>
              <div>
                <span class="text-[9px] text-gray-500 block mb-0.5 flex items-center">
                  <span>Cuota Balón</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5 text-gray-500 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <span class="text-white font-bold text-sm">
                  {{ formatCurrencySymbol(activeSimulation.vehiclePrice) }} {{ formatNumber(calculateBalloonValue()) }}
                </span>
              </div>
              <div>
                <span class="text-[9px] text-gray-500 block mb-0.5">TIR</span>
                <span class="text-accent-gold font-bold text-sm">{{ formatPercentageValue(activeSimulation.tirPercent) }}%</span>
              </div>
            </div>
          </div>

          <!-- Abbreviated cronograma list -->
          <div class="space-y-3">
            <div class="flex items-center justify-between text-[10px] text-gray-500 uppercase font-bold tracking-wider px-1">
              <span>N°</span>
              <span>Principal</span>
              <span>Interés</span>
              <span>Seguros</span>
              <span>Total</span>
            </div>
            <div class="bg-dark-input/10 border border-dark-border rounded-xl divide-y divide-dark-border text-xs">
              <!-- Month 1 row -->
              <div class="px-4 py-2.5 flex items-center justify-between">
                <span class="text-gray-500 font-bold">01</span>
                <span>{{ formatCurrencySymbol(activeSimulation.vehiclePrice) }} {{ formatNumber(activeDrawerFirstAmortization) }}</span>
                <span>{{ formatCurrencySymbol(activeSimulation.vehiclePrice) }} {{ formatNumber(activeDrawerFirstInterest) }}</span>
                <span>{{ formatCurrencySymbol(activeSimulation.vehiclePrice) }} {{ formatNumber(activeDrawerFirstInsurance) }}</span>
                <span class="font-bold text-white">
                  {{ formatCurrencySymbol(activeSimulation.vehiclePrice) }} {{ formatNumber(activeDrawerFirstCuota) }}
                </span>
              </div>
              <!-- Month 2 row -->
              <div class="px-4 py-2.5 flex items-center justify-between">
                <span class="text-gray-500 font-bold">02</span>
                <span>{{ formatCurrencySymbol(activeSimulation.vehiclePrice) }} {{ formatNumber(activeDrawerSecondAmortization) }}</span>
                <span>{{ formatCurrencySymbol(activeSimulation.vehiclePrice) }} {{ formatNumber(activeDrawerSecondInterest) }}</span>
                <span>{{ formatCurrencySymbol(activeSimulation.vehiclePrice) }} {{ formatNumber(activeDrawerSecondInsurance) }}</span>
                <span class="font-bold text-white">
                  {{ formatCurrencySymbol(activeSimulation.vehiclePrice) }} {{ formatNumber(activeDrawerSecondCuota) }}
                </span>
              </div>
              <!-- Separator dots -->
              <div class="py-1 text-center text-gray-600 tracking-widest leading-none font-bold select-none">
                ···
              </div>
              <!-- Month N+1 balloon row -->
              <div class="px-4 py-2.5 flex items-center justify-between bg-accent-gold/5 text-accent-gold font-semibold rounded-b-xl border-t border-accent-gold/10">
                <span class="font-bold">{{ activeSimulation.termMonths }}</span>
                <span>{{ formatCurrencySymbol(activeSimulation.vehiclePrice) }} {{ formatNumber(calculateBalloonValue()) }}</span>
                <span>{{ formatCurrencySymbol(activeSimulation.vehiclePrice) }} {{ formatNumber(activeDrawerBalloonInterest) }}</span>
                <span>{{ formatCurrencySymbol(activeSimulation.vehiclePrice) }} {{ formatNumber(activeDrawerBalloonInsurance) }}</span>
                <span class="font-bold">
                  {{ formatCurrencySymbol(activeSimulation.vehiclePrice) }} {{ formatNumber(activeDrawerBalloonTotal) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Drawer Footer -->
          <div class="flex items-center space-x-3 border-t border-dark-border pt-4 mt-2">
            <button
              (click)="openFullSimulation()"
              class="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 border border-dark-border text-gray-300 font-semibold text-xs rounded-lg transition duration-150"
            >
              Abrir simulación completa
            </button>
            <button
              (click)="exportPDFFromDrawer()"
              class="flex-1 py-2.5 bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs rounded-lg flex items-center justify-center space-x-1.5 transition duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Exportar PDF</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  `
})
export class HistoryComponent implements OnInit {
  simulations: SimulationItem[] = [];
  filteredSimulations: SimulationItem[] = [];
  pagedSimulations: SimulationItem[] = [];
  customers: Customer[] = [];
  vehicles: Vehicle[] = [];

  loading = false;
  searchQuery = '';
  statusFilter = 'ALL';

  // Pagination
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  // Drawer
  isDrawerOpen = false;
  activeSimulation!: SimulationItem;
  activeDrawerIndex = 0;

  // Recalculated values for Drawer schedule summary
  activeDrawerFirstCuota = 0;
  activeDrawerFirstAmortization = 0;
  activeDrawerFirstInterest = 0;
  activeDrawerFirstInsurance = 0;

  activeDrawerSecondCuota = 0;
  activeDrawerSecondAmortization = 0;
  activeDrawerSecondInterest = 0;
  activeDrawerSecondInsurance = 0;

  activeDrawerBalloonInterest = 0;
  activeDrawerBalloonInsurance = 0;
  activeDrawerBalloonTotal = 0;

  constructor(
    private router: Router,
    private simulationService: SimulationService,
    private customerService: CustomerService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.loading = true;
    // Load catalogs to resolve names in the list view
    this.customerService.getAll().subscribe({
      next: (data) => { this.customers = data; },
      error: () => this.seedMockCustomers()
    });

    this.vehicleService.getAll().subscribe({
      next: (data) => { this.vehicles = data; },
      error: () => this.seedMockVehicles()
    });

    this.simulationService.getAll().subscribe({
      next: (data) => {
        // Spring Page response wraps items in .content
        this.simulations = data?.content || data || [];
        this.onFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.loadMockHistory();
      }
    });
  }

  seedMockCustomers() {
    this.customers = [
      { id: 1, firstName: 'Mateo', lastName: 'Rojas', email: 'mrojas@example.com', phoneNumber: '987 654 321', documentType: 'DNI', documentNumber: '78451236' },
      { id: 2, firstName: 'Sofía', lastName: 'Castro', email: 'scastro@example.com', phoneNumber: '955 456 789', documentType: 'DNI', documentNumber: '45678912' },
      { id: 3, firstName: 'Carlos', lastName: 'Vera', email: 'cvera@example.com', phoneNumber: '922 789 123', documentType: 'DNI', documentNumber: '12345678' },
      { id: 4, firstName: 'Elena', lastName: 'Rivas', email: 'erivas@example.com', phoneNumber: '988 987 654', documentType: 'DNI', documentNumber: '98765432' }
    ];
  }

  seedMockVehicles() {
    this.vehicles = [
      { id: 1, brand: 'Toyota', model: 'Yaris 2024', price: 60000, imageUrl: 'Sedan', year: 2024 },
      { id: 2, brand: 'Ford', model: 'Ranger XLT', price: 120000, imageUrl: 'Pick-up', year: 2023 },
      { id: 3, brand: 'Mercedes Benz', model: 'C200', price: 65000, imageUrl: 'Sedan', year: 2023 },
      { id: 4, brand: 'Hyundai', model: 'Tucson', price: 85000, imageUrl: 'SUV', year: 2024 }
    ];
  }

  loadMockHistory() {
    this.simulations = [
      {
        id: 1089, code: 'SIM-001089', vehiclePrice: 60000,
        downPaymentPercent: 20.0, balloonPercent: 40.0, termMonths: 36,
        teaPercent: 14.0, temPercent: 1.0991,
        financedAmount: 48000, tirPercent: 16.08, tceaPercent: 16.08, van: 1250.00, clientId: 1, vehicleId: 1,
        createdDate: '2023-10-24T10:00:00', currency: 'PEN', status: 'Guardado', graceType: 'NONE', graceMonths: 0,
        firstPaymentDate: '2023-11-24', creditLifeInsuranceMonthlyPercent: 0.05, vehicleInsuranceAnnualPercent: 1.2,
        monthlyPayment: 1800.0, totalInterest: 10000, totalInsurance: 2000, totalFees: 0, totalPayment: 60000
      },
      {
        id: 1088, code: 'SIM-001088', vehiclePrice: 120000,
        downPaymentPercent: 25.0, balloonPercent: 30.0, termMonths: 24,
        teaPercent: 13.0, temPercent: 1.021,
        financedAmount: 90000, tirPercent: 15.20, tceaPercent: 15.20, van: -100.00, clientId: 2, vehicleId: 2,
        createdDate: '2023-10-23T11:30:00', currency: 'USD', status: 'Guardado', graceType: 'NONE', graceMonths: 0,
        firstPaymentDate: '2023-11-23', creditLifeInsuranceMonthlyPercent: 0.05, vehicleInsuranceAnnualPercent: 1.2,
        monthlyPayment: 3800.0, totalInterest: 15000, totalInsurance: 3000, totalFees: 0, totalPayment: 108000
      },
      {
        id: 1087, code: 'SIM-001087', vehiclePrice: 65000,
        downPaymentPercent: 15.0, balloonPercent: 15.0, termMonths: 36,
        teaPercent: 12.0, temPercent: 0.94,
        financedAmount: 55250, tirPercent: 13.80, tceaPercent: 13.80, van: 2500.00, clientId: 3, vehicleId: 3,
        createdDate: '2023-10-21T09:15:00', currency: 'PEN', status: 'Guardado', graceType: 'NONE', graceMonths: 0,
        firstPaymentDate: '2023-11-21', creditLifeInsuranceMonthlyPercent: 0.05, vehicleInsuranceAnnualPercent: 1.2,
        monthlyPayment: 2100.0, totalInterest: 11000, totalInsurance: 2200, totalFees: 0, totalPayment: 68000
      },
      {
        id: 1086, code: 'SIM-001086', vehiclePrice: 85000,
        downPaymentPercent: 20.0, balloonPercent: 25.0, termMonths: 48,
        teaPercent: 14.0, temPercent: 1.09,
        financedAmount: 68000, tirPercent: 16.10, tceaPercent: 16.10, van: -850.00, clientId: 4, vehicleId: 4,
        createdDate: '2023-10-20T16:45:00', currency: 'PEN', status: 'Guardado', graceType: 'NONE', graceMonths: 0,
        firstPaymentDate: '2023-11-20', creditLifeInsuranceMonthlyPercent: 0.05, vehicleInsuranceAnnualPercent: 1.2,
        monthlyPayment: 2000.0, totalInterest: 13000, totalInsurance: 2800, totalFees: 0, totalPayment: 83000
      }
    ];
    this.onFilter();
  }

  // Formatting helpers
  formatId(id: number): string {
    return String(id).padStart(4, '0');
  }

  getCustomerName(id: number): string {
    const customer = this.customers.find(c => c.id === id);
    return customer ? `${customer.firstName} ${customer.lastName}` : 'Desconocido';
  }

  getVehicleName(id: number): string {
    const vehicle = this.vehicles.find(v => v.id === id);
    return vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Desconocido';
  }

  getVehicleCategory(id: number): string {
    const vehicle = this.vehicles.find(v => v.id === id);
    return vehicle && vehicle.imageUrl ? vehicle.imageUrl : 'Sedan';
  }

  getFormattedDate(dateStr: string, idx: number): string {
    if (!dateStr) return '24 Oct 2023';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  getMockStatus(idx: number): string {
    const statuses = ['Aprobado', 'Pendiente', 'Aprobado', 'Rechazado'];
    return statuses[idx % statuses.length];
  }

  getStatusClass(idx: number): string {
    const status = this.getMockStatus(idx);
    if (status === 'Aprobado') return 'bg-status-completed-bg text-status-completed-text border border-status-completed-text/25';
    if (status === 'Pendiente') return 'bg-yellow-950/20 text-yellow-600 border border-yellow-700/25';
    return 'bg-status-rejected-bg text-status-rejected-text border border-status-rejected-text/25';
  }

  // Filters logic
  onFilter() {
    let list = [...this.simulations];

    // Status
    if (this.statusFilter !== 'ALL') {
      list = list.filter((sim, idx) => this.getMockStatus(idx) === this.statusFilter);
    }

    // Search Query (resolving ID or Customer Name)
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter((sim) => {
        const idStr = `SIM-${this.formatId(sim.id)}`.toLowerCase();
        const clientName = this.getCustomerName(sim.clientId).toLowerCase();
        return idStr.includes(q) || clientName.includes(q);
      });
    }

    this.filteredSimulations = list;
    this.currentPage = 1;
    this.calculatePagination();
  }

  // Pagination logic
  calculatePagination() {
    this.totalPages = Math.max(1, Math.ceil(this.filteredSimulations.length / this.pageSize));
    this.updatePagedList();
  }

  updatePagedList() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedSimulations = this.filteredSimulations.slice(start, end);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagedList();
    }
  }

  getPageNumbers(): number[] {
    const arr: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) arr.push(i);
    return arr;
  }

  getShowingRangeText(): string {
    if (this.filteredSimulations.length === 0) return '0-0';
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(start + this.pageSize - 1, this.filteredSimulations.length);
    return `${start}-${end}`;
  }

  formatEvaluatedAmount(): string {
    const sum = this.filteredSimulations.reduce((acc, curr) => acc + curr.financedAmount, 0);
    if (sum >= 1000000) {
      return (sum / 1000000).toFixed(2) + 'M';
    }
    return this.formatNumber(sum);
  }

  formatAverageTir(): string {
    if (this.filteredSimulations.length === 0) return '0.00';
    const sum = this.filteredSimulations.reduce((acc, curr) => acc + curr.tirPercent, 0);
    return (sum / this.filteredSimulations.length).toFixed(2);
  }

  openDrawer(simulation: SimulationItem, index: number) {
    this.activeSimulation = simulation;
    this.activeDrawerIndex = index;
    
    // Recalculate schedule values via simulation service
    this.simulationService.getById(simulation.id).subscribe({
      next: (res) => {
        const schedule = res.schedule;
        if (schedule && schedule.length > 0) {
          // Month 1 details
          const first = schedule[0];
          this.activeDrawerFirstAmortization = first.amortization;
          this.activeDrawerFirstInterest = first.interest;
          this.activeDrawerFirstInsurance = first.vehicleInsurance + first.commission + first.creditLifeInsurance;
          this.activeDrawerFirstCuota = first.payment;

          // Month 2 details
          if (schedule.length > 1) {
            const second = schedule[1];
            this.activeDrawerSecondAmortization = second.amortization;
            this.activeDrawerSecondInterest = second.interest;
            this.activeDrawerSecondInsurance = second.vehicleInsurance + second.commission + second.creditLifeInsurance;
            this.activeDrawerSecondCuota = second.payment;
          }

          // Last month (Balloon) details
          const last = schedule[schedule.length - 1];
          this.activeDrawerBalloonInterest = last.interest;
          this.activeDrawerBalloonInsurance = last.vehicleInsurance + last.commission + last.creditLifeInsurance;
          this.activeDrawerBalloonTotal = last.payment;
        }
        this.isDrawerOpen = true;
      },
      error: () => {
        // Fallback mockup calculation if server recalculation fails
        const mockFirstCuota = this.activeSimulation.financedAmount * 0.027; // approx monthly payment
        this.activeDrawerFirstCuota = mockFirstCuota;
        this.activeDrawerFirstAmortization = mockFirstCuota * 0.5;
        this.activeDrawerFirstInterest = mockFirstCuota * 0.4;
        this.activeDrawerFirstInsurance = mockFirstCuota * 0.1;

        this.activeDrawerSecondCuota = mockFirstCuota;
        this.activeDrawerSecondAmortization = mockFirstCuota * 0.51;
        this.activeDrawerSecondInterest = mockFirstCuota * 0.39;
        this.activeDrawerSecondInsurance = mockFirstCuota * 0.1;

        this.activeDrawerBalloonInterest = this.calculateBalloonValue() * 0.01;
        this.activeDrawerBalloonInsurance = 90.00;
        this.activeDrawerBalloonTotal = this.calculateBalloonValue() + this.activeDrawerBalloonInterest + 90.00;
        this.isDrawerOpen = true;
      }
    });
  }

  closeDrawer() {
    this.isDrawerOpen = false;
  }

  calculateInitialPaymentValue(): number {
    return this.activeSimulation.vehiclePrice * (this.activeSimulation.downPaymentPercent / 100);
  }

  calculateBalloonValue(): number {
    return this.activeSimulation.balloonAmount || 0;
  }

  openFullSimulation() {
    this.closeDrawer();
    // Navigate to wizard page or result component using local routing or query params
    // Let's redirect to simulations and pass params or just simulated details
    this.router.navigate(['/simulaciones']);
  }

  exportPDFFromDrawer() {
    window.print();
  }

  exportCSV() {
    let csv = 'ID,Cliente,Vehiculo,Moneda,Monto,Tir,Cuota Balon,Fecha,Estado\n';
    this.filteredSimulations.forEach((sim, idx) => {
      const row = [
        sim.code || `SIM-${this.formatId(sim.id)}`,
        this.getCustomerName(sim.clientId),
        this.getVehicleName(sim.vehicleId),
        sim.currency || 'PEN',
        sim.financedAmount,
        this.formatPercentageValue(sim.tirPercent) + '%',
        this.formatPercentageValue(sim.balloonPercent) + '%',
        this.getFormattedDate(sim.createdDate, idx),
        sim.status || this.getMockStatus(idx)
      ];
      csv += row.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Historial_Evaluaciones_CrediTrack.csv';
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  downloadExcel(sim: SimulationItem) {
    const customerName = this.getCustomerName(sim.clientId);
    const trxId = sim.code || this.formatId(sim.id);
    const isSoles = sim.currency === 'PEN';
    const currencySymbol = isSoles ? 'S/' : 'USD';

    this.simulationService.getById(sim.id).subscribe({
      next: (res) => {
        const schedule = res.schedule;
        if (!schedule || schedule.length === 0) return;

        // Import ExcelJS dynamically to maintain tiny initial bundle size
        import('exceljs').then((ExcelJSModule: any) => {
          const ExcelJS = ExcelJSModule.default || ExcelJSModule;
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet(`Simulación TRX-${trxId}`);

          worksheet.columns = [
            { header: 'N°', key: 'month', width: 6 },
            { header: 'Fecha', key: 'date', width: 12 },
            { header: 'Saldo Inicial', key: 'initial', width: 15 },
            { header: 'Interés', key: 'interest', width: 15 },
            { header: 'Desgravamen', key: 'desgravamen', width: 15 },
            { header: 'Seg. Vehicular', key: 'insurance', width: 15 },
            { header: 'Portes', key: 'portes', width: 12 },
            { header: 'Amortización', key: 'amortization', width: 15 },
            { header: 'Cuota', key: 'cuota', width: 15 },
            { header: 'Saldo Final', key: 'final', width: 15 },
            { header: 'Tipo', key: 'type', width: 10 }
          ];

          // Banner Title
          worksheet.mergeCells('A1:K1');
          const titleCell = worksheet.getCell('A1');
          titleCell.value = 'REPORTE DE SIMULACIÓN FINANCIERA — CREDISTRACK';
          titleCell.font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
          titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
          titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
          worksheet.getRow(1).height = 30;

          // Spacing
          worksheet.addRow([]);

          // Section titles
          worksheet.mergeCells('A3:D3');
          const sec1Cell = worksheet.getCell('A3');
          sec1Cell.value = 'DATOS DEL CRÉDITO';
          sec1Cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF1E3A8A' } };
          sec1Cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFF6FF' } };

          worksheet.mergeCells('F3:H3');
          const sec2Cell = worksheet.getCell('F3');
          sec2Cell.value = 'PARÁMETROS FINANCIEROS Y CARGOS';
          sec2Cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF1E3A8A' } };
          sec2Cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFF6FF' } };

          worksheet.mergeCells('J3:K3');
          const sec3Cell = worksheet.getCell('J3');
          sec3Cell.value = 'INDICADORES CLAVE';
          sec3Cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF1E3A8A' } };
          sec3Cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFF6FF' } };

          const setMeta = (rowIdx: number, colLabel: string, label: string, colVal: string, value: any, numFormat?: string) => {
            const labelCell = worksheet.getCell(`${colLabel}${rowIdx}`);
            labelCell.value = label;
            labelCell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: 'FF4B5563' } };

            const valCell = worksheet.getCell(`${colVal}${rowIdx}`);
            valCell.value = value;
            valCell.font = { name: 'Segoe UI', size: 9, color: { argb: 'FF111827' } };
            if (numFormat) {
              valCell.numFormat = numFormat;
            }
          };

          // Row 4
          setMeta(4, 'A', 'Cliente:', 'B', customerName);
          setMeta(4, 'F', 'Tasa Base Anual:', 'G', `TEA ${res.teaPercent}%`);
          setMeta(4, 'J', 'VAN Deudor:', 'K', res.van, `$#,##0.00;($#,##0.00);"-"`);

          // Row 5
          setMeta(5, 'A', 'Vehículo:', 'B', this.getVehicleName(res.vehicleId));
          setMeta(5, 'F', 'Tasa Periodo (TEM):', 'G', res.temPercent / 100, '0.0000%');
          setMeta(5, 'J', 'TIR de Operación:', 'K', res.tirPercent / 100, '0.00%');

          // Row 6
          setMeta(6, 'A', 'Precio:', 'B', res.vehiclePrice, `$#,##0.00`);
          setMeta(6, 'F', 'Período Gracia:', 'G', res.graceType);
          setMeta(6, 'J', 'TCEA Proyectada:', 'K', res.tceaPercent / 100, '0.00%');

          // Row 7
          setMeta(7, 'A', 'Cuota Inicial:', 'B', res.vehiclePrice * (res.downPaymentPercent / 100), `$#,##0.00`);
          setMeta(7, 'F', 'Seg. Desgravamen:', 'G', res.creditLifeInsuranceMonthlyPercent / 100, '0.000%');
          setMeta(7, 'J', 'Moneda:', 'K', currencySymbol);

          // Row 8
          setMeta(8, 'A', 'Monto Préstamo:', 'B', res.financedAmount, `$#,##0.00`);
          setMeta(8, 'F', 'Seguro Vehicular:', 'G', (res.vehicleInsuranceAnnualPercent / 100) * res.vehiclePrice / 12, `$#,##0.00`);
          setMeta(8, 'J', 'Plazo (Meses):', 'K', res.termMonths);

          // Row 9
          setMeta(9, 'A', 'Cuota Balón:', 'B', res.balloonAmount, `$#,##0.00`);
          setMeta(9, 'F', 'Portes:', 'G', 10.0, `$#,##0.00`);

          worksheet.addRow([]);
          worksheet.addRow([]);

          // Headers row (Row 12)
          const headerRow = worksheet.addRow([
            'N°', 'Fecha', 'Saldo Inicial', 'Interés', 'Desgravamen', 
            'Seg. Vehicular', 'Portes', 'Amortización', 'Cuota', 'Saldo Final', 'Tipo'
          ]);
          headerRow.height = 25;
          headerRow.eachCell((cell: any) => {
            cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
          });

          let totalInterest = 0;
          let totalDesgravamen = 0;
          let totalInsurance = 0;
          let totalPortes = 0;
          let totalAmortization = 0;
          let totalCuota = 0;

          schedule.forEach((item: any) => {
            const isBal = item.period === res.termMonths;
            const initial = item.initialBalance;
            const interest = item.interest;
            const desgravamen = item.creditLifeInsurance;
            const insurance = item.vehicleInsurance;
            const portes = item.commission;
            const amortization = item.amortization;
            const final = item.finalBalance;
            
            const cuota = item.payment;
            const dateStr = item.date;

            totalInterest += interest;
            totalDesgravamen += desgravamen;
            totalInsurance += insurance;
            totalPortes += portes;
            totalAmortization += amortization;
            totalCuota += cuota;

            const row = worksheet.addRow([
              item.period,
              dateStr,
              initial,
              interest,
              desgravamen,
              insurance,
              portes,
              amortization,
              cuota,
              final,
              isBal && res.balloonAmount > 0 ? 'BALON' : item.graceType
            ]);

            row.height = 20;

            row.eachCell((cell: any, colNumber: number) => {
              cell.alignment = { vertical: 'middle' };
              cell.border = { bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } } };

              if (colNumber >= 3 && colNumber <= 10) {
                cell.numFormat = `#,##0.00`;
                cell.alignment = { horizontal: 'right', vertical: 'middle' };
              }

              if (isBal) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
                cell.font = { name: 'Segoe UI', color: { argb: 'FFB45309' }, bold: true };
                cell.border = { bottom: { style: 'thin', color: { argb: 'FFFDE68A' } } };
              }
            });
          });

          // Totals row
          const totalsRow = worksheet.addRow([
            'TOTALES', '', '', totalInterest, totalDesgravamen, 
            totalInsurance, totalPortes, totalAmortization, totalCuota, '', ''
          ]);
          worksheet.mergeCells(`A${totalsRow.number}:C${totalsRow.number}`);
          totalsRow.height = 22;
          totalsRow.eachCell((cell: any, colNumber: number) => {
            cell.font = { name: 'Segoe UI', bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF334155' } };
            cell.alignment = { vertical: 'middle' };
            if (colNumber >= 4 && colNumber <= 9) {
              cell.numFormat = `#,##0.00`;
              cell.alignment = { horizontal: 'right', vertical: 'middle' };
            }
          });

          workbook.xlsx.writeBuffer().then((buffer: any) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `Cronograma_TRX-${trxId}_${customerName.replace(/\s+/g, '_')}.xlsx`;
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          });
        }).catch(err => {
          console.error('Failed to export Excel', err);
          alert('Error al exportar a Excel.');
        });
      },
      error: () => {
        alert('Error al recuperar los datos del cronograma del servidor.');
      }
    });
  }

  downloadPDF(sim: SimulationItem) {
    this.openDrawer(sim, 0);
    setTimeout(() => {
      window.print();
    }, 500);
  }

  getPaymentDateForExcel(monthIndex: number, createdDate: string): string {
    const d = new Date();
    if (createdDate) {
      const parsedDate = new Date(createdDate);
      if (!isNaN(parsedDate.getTime())) {
        d.setTime(parsedDate.getTime());
      }
    }
    d.setMonth(d.getMonth() + monthIndex);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }

  formatCurrencySymbol(price: number): string {
    return price <= 35000 ? 'USD' : 'S/';
  }

  formatNumber(val: number): string {
    return new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
  }

  formatPercentage(val: number): string {
    return (val * 100).toFixed(2);
  }

  formatPercentageValue(val: number): string {
    if (val == null) return '0.00';
    return Number(val).toFixed(2);
  }
}
