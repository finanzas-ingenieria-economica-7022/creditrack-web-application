import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ScheduleItem {
  month: number;
  graceType: string;
  balloonInitialBalance: number;
  balloonInterest: number;
  balloonAmortization: number;
  balloonDesgravamen: number;
  balloonFinalBalance: number;
  regularInitialBalance: number;
  regularInterest: number;
  regularCuota: number;
  regularAmortization: number;
  regularDesgravamen: number;
  regularFinalBalance: number;
  riskInsurance: number;
  gps: number;
  portes: number;
  adminFee: number;
  netCashFlow: number;
}

@Component({
  selector: 'app-simulation-schedule',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      
      <!-- Header / Breadcrumbs -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="text-xs text-gray-500">
          <span>Simulaciones</span>
          <span class="mx-2">&gt;</span>
          <span class="text-white font-semibold">TRX-{{ getTrxId() }} — {{ getCustomerName() }}</span>
        </div>

        <div class="flex items-center space-x-3 shrink-0">
          <button (click)="exportPDF()" class="px-4 py-2 border border-dark-border hover:bg-gray-800 text-gray-300 font-semibold text-xs rounded-lg transition duration-150">
            Exportar PDF
          </button>
          <button (click)="exportExcel()" class="px-4 py-2 border border-dark-border hover:bg-gray-800 text-gray-300 font-semibold text-xs rounded-lg transition duration-150">
            Exportar Excel
          </button>
          <button (click)="onViewIndicators()" class="px-4 py-2 bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs rounded-lg flex items-center space-x-1.5 transition duration-150">
            <span>Ver indicadores</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>

      <!-- KPI metrics row -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <!-- MONTO FINANCIADO -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-5 space-y-1">
          <span class="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Monto Financiado</span>
          <div class="text-lg font-bold text-white">{{ formatCurrencySymbol() }} {{ formatNumber(simulation.loanAmount) }}</div>
        </div>

        <!-- CUOTA MENSUAL -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-5 space-y-1">
          <span class="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Cuota Mensual</span>
          <div class="text-lg font-bold text-white">{{ formatCurrencySymbol() }} {{ formatNumber(getFirstMonthRegularCuota()) }}</div>
        </div>

        <!-- CUOTA BALÓN -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-5 space-y-1 relative">
          <span class="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Cuota Balón</span>
          <div class="text-lg font-bold text-white">{{ formatCurrencySymbol() }} {{ formatNumber(getBalloonTotalAmount()) }}</div>
          <span class="absolute top-3 right-3 px-1.5 py-0.5 bg-yellow-950/30 border border-yellow-700/20 text-accent-gold text-[8px] font-bold rounded">
            MES {{ simulation.termMonths }}
          </span>
        </div>

        <!-- VAN DEUDOR -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-5 space-y-1">
          <span class="text-[9px] font-bold text-gray-500 uppercase tracking-wider flex items-center">
            <span>Van Deudor</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-gray-500 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <div class="text-lg font-bold text-white">{{ formatCurrencySymbol() }} {{ formatNumber(simulation.van) }}</div>
        </div>

        <!-- TIR MENSUAL -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-5 space-y-1">
          <span class="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Tir Mensual</span>
          <div class="text-lg font-bold text-accent-gold">{{ formatPercentage(simulation.tir) }}%</div>
        </div>
      </div>

      <!-- Schedule Table -->
      <div class="bg-dark-card border border-dark-border rounded-xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr class="border-b border-dark-border text-gray-500 text-[10px] uppercase font-bold tracking-wider">
                <th class="px-4 py-4 text-center">N°</th>
                <th class="px-4 py-4">Fecha</th>
                <th class="px-4 py-4">Saldo Inicial</th>
                <th class="px-4 py-4">Interés</th>
                <th class="px-4 py-4">Desgravamen</th>
                <th class="px-4 py-4">Seg. Vehicular</th>
                <th class="px-4 py-4">Portes</th>
                <th class="px-4 py-4">Amortización</th>
                <th class="px-4 py-4">Cuota</th>
                <th class="px-4 py-4">Saldo Final</th>
                <th class="px-4 py-4 text-right">Tipo</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-dark-border text-xs text-gray-300">
              <tr
                *ngFor="let item of schedule"
                class="hover:bg-gray-800/10 transition duration-100"
                [ngClass]="isBalloonRow(item) ? 'bg-yellow-950/5 text-accent-gold font-semibold' : ''"
              >
                <td class="px-4 py-3.5 text-center font-bold" [ngClass]="isBalloonRow(item) ? 'text-accent-gold' : 'text-gray-500'">
                  {{ item.month }}
                </td>
                <td class="px-4 py-3.5">{{ getPaymentDate(item.month) }}</td>
                
                <!-- Initial Balance -->
                <td class="px-4 py-3.5">
                  {{ formatCurrencySymbol() }} {{ formatNumber(isBalloonRow(item) ? item.balloonInitialBalance : item.regularInitialBalance) }}
                </td>
                
                <!-- Interest -->
                <td class="px-4 py-3.5 text-yellow-600/90 font-medium">
                  {{ formatCurrencySymbol() }} {{ formatNumber(isBalloonRow(item) ? item.balloonInterest : item.regularInterest) }}
                </td>
                
                <!-- Desgravamen -->
                <td class="px-4 py-3.5">
                  {{ formatCurrencySymbol() }} {{ formatNumber(isBalloonRow(item) ? item.balloonDesgravamen : item.regularDesgravamen) }}
                </td>
                
                <!-- Seg Vehicular -->
                <td class="px-4 py-3.5">
                  {{ formatCurrencySymbol() }} {{ formatNumber(item.riskInsurance) }}
                </td>
                
                <!-- Portes -->
                <td class="px-4 py-3.5">
                  {{ formatCurrencySymbol() }} {{ formatNumber(item.portes) }}
                </td>
                
                <!-- Amortización -->
                <td class="px-4 py-3.5">
                  {{ formatCurrencySymbol() }} {{ formatNumber(isBalloonRow(item) ? item.balloonInitialBalance : item.regularAmortization) }}
                </td>
                
                <!-- Cuota (Amortizacion + Interes + Desgravamen + SegVehicular + Portes) -->
                <td class="px-4 py-3.5 font-bold" [ngClass]="isBalloonRow(item) ? 'text-accent-gold' : 'text-white'">
                  {{ formatCurrencySymbol() }} {{ formatNumber(calculateRowCuota(item)) }}
                </td>
                
                <!-- Saldo Final -->
                <td class="px-4 py-3.5">
                  {{ formatCurrencySymbol() }} {{ formatNumber(isBalloonRow(item) ? 0.00 : item.regularFinalBalance) }}
                </td>
                
                <!-- Tipo -->
                <td class="px-4 py-3.5 text-right">
                  <span
                    class="inline-block px-2 py-0.5 rounded text-[8px] font-bold tracking-wider"
                    [ngClass]="isBalloonRow(item) ? 'bg-accent-gold/20 text-accent-gold border border-accent-gold/30' : 'bg-gray-800 text-gray-500'"
                  >
                    {{ isBalloonRow(item) ? 'BALÓN' : 'BASE' }}
                  </span>
                </td>
              </tr>
              
              <!-- Totals row -->
              <tr class="bg-dark-input/20 font-bold border-t border-dark-border text-white text-xs select-none">
                <td colspan="3" class="px-4 py-4 text-right uppercase tracking-wider">Totales</td>
                <td class="px-4 py-4 text-yellow-600/90">{{ formatCurrencySymbol() }} {{ formatNumber(totals.interest) }}</td>
                <td class="px-4 py-4">{{ formatCurrencySymbol() }} {{ formatNumber(totals.desgravamen) }}</td>
                <td class="px-4 py-4">{{ formatCurrencySymbol() }} {{ formatNumber(totals.insurance) }}</td>
                <td class="px-4 py-4">{{ formatCurrencySymbol() }} {{ formatNumber(totals.portes) }}</td>
                <td class="px-4 py-4">{{ formatCurrencySymbol() }} {{ formatNumber(totals.amortization) }}</td>
                <td class="px-4 py-4 text-brand-text">{{ formatCurrencySymbol() }} {{ formatNumber(totals.cuota) }}</td>
                <td colspan="2" class="px-4 py-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Start new simulation button -->
      <div class="flex justify-start">
        <button
          type="button"
          (click)="onNewSimulation()"
          class="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 border border-dark-border text-gray-300 font-semibold text-xs rounded-lg transition duration-150"
        >
          Nueva Simulación
        </button>
      </div>

    </div>
  `
})
export class SimulationScheduleComponent {
  @Input() result!: { simulation: any; schedule: ScheduleItem[] };
  @Input() customerName = '';
  @Output() viewIndicators = new EventEmitter<void>();
  @Output() newSimulation = new EventEmitter<void>();

  get simulation() {
    return this.result.simulation;
  }

  get schedule() {
    return this.result.schedule;
  }

  getTrxId(): string {
    if (!this.simulation.id) return '0091';
    return String(this.simulation.id).padStart(4, '0');
  }

  getCustomerName(): string {
    return this.customerName || 'Cliente';
  }

  getFirstMonthRegularCuota(): number {
    if (this.schedule.length > 0) {
      return this.calculateRowCuota(this.schedule[0]);
    }
    return 0;
  }

  getBalloonTotalAmount(): number {
    // Find the balloon row (which is the last item)
    if (this.schedule.length > 0) {
      const last = this.schedule[this.schedule.length - 1];
      return last.balloonInitialBalance;
    }
    return 0;
  }

  isBalloonRow(item: ScheduleItem): boolean {
    return item.month === this.simulation.termMonths && item.balloonInitialBalance > 0;
  }

  calculateRowCuota(item: ScheduleItem): number {
    const isBal = this.isBalloonRow(item);
    const interest = isBal ? item.balloonInterest : item.regularInterest;
    const desgravamen = isBal ? item.balloonDesgravamen : item.regularDesgravamen;
    const amort = isBal ? item.balloonInitialBalance : item.regularAmortization;
    return interest + desgravamen + item.riskInsurance + item.portes + amort;
  }

  getPaymentDate(monthIndex: number): string {
    const d = new Date();
    // Use created date if available
    if (this.simulation.createdDate) {
      const parsedDate = new Date(this.simulation.createdDate);
      if (!isNaN(parsedDate.getTime())) {
        d.setTime(parsedDate.getTime());
      }
    }
    d.setMonth(d.getMonth() + monthIndex);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }

  // Totals calculations
  get totals() {
    let interest = 0;
    let desgravamen = 0;
    let insurance = 0;
    let portes = 0;
    let amortization = 0;
    let cuota = 0;

    this.schedule.forEach(item => {
      const isBal = this.isBalloonRow(item);
      interest += isBal ? item.balloonInterest : item.regularInterest;
      desgravamen += isBal ? item.balloonDesgravamen : item.regularDesgravamen;
      insurance += item.riskInsurance;
      portes += item.portes;
      amortization += isBal ? item.balloonInitialBalance : item.regularAmortization;
      cuota += this.calculateRowCuota(item);
    });

    return { interest, desgravamen, insurance, portes, amortization, cuota };
  }

  onViewIndicators() {
    this.viewIndicators.emit();
  }

  onNewSimulation() {
    this.newSimulation.emit();
  }

  exportPDF() {
    alert('Función de exportación a PDF en construcción. Disponible próximamente.');
  }

  exportExcel() {
    alert('Función de exportación a Excel en construcción. Disponible próximamente.');
  }

  formatCurrencySymbol(): string {
    // Soles or dollars based on simulation params
    // Let's decide based on price thresholds or fallback to soles
    return this.simulation.vehiclePrice <= 35000 ? 'USD' : 'S/';
  }

  formatNumber(val: number): string {
    return new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
  }

  formatPercentage(val: number): string {
    return (val * 100).toFixed(2);
  }
}
