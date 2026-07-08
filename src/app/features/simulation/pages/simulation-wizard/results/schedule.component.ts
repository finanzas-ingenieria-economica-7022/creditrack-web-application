import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PaymentRow {
  period: number;
  date: string;
  initialBalance: number;
  payment: number;
  balloonPayment: number;
  interest: number;
  amortization: number;
  insurance: number;
  creditLifeInsurance: number;
  vehicleInsurance: number;
  commission: number;
  totalPayment: number;
  finalBalance: number;
  graceType: string;
}

@Component({
  selector: 'app-simulation-schedule',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="text-xs text-gray-500">
          <span>Simulaciones</span>
          <span class="mx-2">&gt;</span>
          <span class="text-white font-semibold">{{ result?.code || 'SIM-000001' }} — {{ getCustomerName() }}</span>
        </div>
        <div class="flex items-center space-x-3 shrink-0">
          <button (click)="exportPDF()" class="px-4 py-2 border border-dark-border hover:bg-gray-800 text-gray-300 font-semibold text-xs rounded-lg transition duration-150">Exportar PDF</button>
          <button (click)="onViewIndicators()" class="px-4 py-2 bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs rounded-lg flex items-center space-x-1.5 transition duration-150">
            <span>Ver indicadores</span><span>&rarr;</span>
          </button>
        </div>
      </div>

      <!-- KPI row -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div class="bg-dark-card border border-dark-border rounded-xl p-5 space-y-1">
          <span class="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Monto Financiado</span>
          <div class="text-lg font-bold text-white">{{ formatCurrencySymbol() }} {{ formatMoney(result?.financedAmount) }}</div>
        </div>
        <div class="bg-dark-card border border-dark-border rounded-xl p-5 space-y-1">
          <span class="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Cuota Mensual</span>
          <div class="text-lg font-bold text-white">{{ formatCurrencySymbol() }} {{ formatMoney(result?.monthlyPayment) }}</div>
        </div>
        <div class="bg-dark-card border border-dark-border rounded-xl p-5 space-y-1 relative">
          <span class="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Cuota Balon</span>
          <div class="text-lg font-bold text-white">{{ formatCurrencySymbol() }} {{ formatMoney(result?.balloonAmount) }}</div>
          <span class="absolute top-3 right-3 px-1.5 py-0.5 bg-yellow-950/30 border border-yellow-700/20 text-accent-gold text-[8px] font-bold rounded">MES {{ result?.termMonths }}</span>
        </div>
        <div class="bg-dark-card border border-dark-border rounded-xl p-5 space-y-1">
          <span class="text-[9px] font-bold text-gray-500 uppercase tracking-wider">VAN Deudor</span>
          <div class="text-lg font-bold text-white">{{ formatCurrencySymbol() }} {{ formatMoney(result?.van) }}</div>
        </div>
        <div class="bg-dark-card border border-dark-border rounded-xl p-5 space-y-1">
          <span class="text-[9px] font-bold text-gray-500 uppercase tracking-wider">TIR Mensual</span>
          <div class="text-lg font-bold text-accent-gold">{{ formatPercent7(result?.tirPercent) }}%</div>
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
                <th class="px-4 py-4">Interes</th>
                <th class="px-4 py-4">Amortizacion</th>
                <th class="px-4 py-4">Desgravamen</th>
                <th class="px-4 py-4">Seg. Vehicular</th>
                <th class="px-4 py-4">Cuota</th>
                <th class="px-4 py-4">Cuota Balon</th>
                <th class="px-4 py-4">Saldo Final</th>
                <th class="px-4 py-4 text-right">Tipo</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-dark-border text-xs text-gray-300">
              <tr *ngFor="let row of getSchedule()" class="hover:bg-gray-800/10 transition duration-100"
                [ngClass]="isLastRow(row) && hasBalloon() ? 'bg-yellow-950/5 text-accent-gold font-semibold' : ''">
                <td class="px-4 py-3.5 text-center font-bold" [ngClass]="isLastRow(row) && hasBalloon() ? 'text-accent-gold' : 'text-gray-500'">{{ row.period }}</td>
                <td class="px-4 py-3.5">{{ row.date }}</td>
                <td class="px-4 py-3.5">{{ formatCurrencySymbol() }} {{ formatMoney(row.initialBalance) }}</td>
                <td class="px-4 py-3.5 text-yellow-600/90 font-medium">{{ formatCurrencySymbol() }} {{ formatMoney(row.interest) }}</td>
                <td class="px-4 py-3.5">{{ formatCurrencySymbol() }} {{ formatMoney(row.amortization) }}</td>
                <td class="px-4 py-3.5">{{ formatCurrencySymbol() }} {{ formatMoney(row.creditLifeInsurance) }}</td>
                <td class="px-4 py-3.5">{{ formatCurrencySymbol() }} {{ formatMoney(row.vehicleInsurance) }}</td>
                <td class="px-4 py-3.5 font-bold" [ngClass]="isLastRow(row) && hasBalloon() ? 'text-accent-gold' : 'text-white'">{{ formatCurrencySymbol() }} {{ formatMoney(row.payment) }}</td>
                <td class="px-4 py-3.5">{{ row.balloonPayment > 0 ? formatCurrencySymbol() + ' ' + formatMoney(row.balloonPayment) : '-' }}</td>
                <td class="px-4 py-3.5">{{ formatCurrencySymbol() }} {{ formatMoney(row.finalBalance) }}</td>
                <td class="px-4 py-3.5 text-right">
                  <span class="inline-block px-2 py-0.5 rounded text-[8px] font-bold tracking-wider"
                    [ngClass]="isLastRow(row) && hasBalloon() ? 'bg-accent-gold/20 text-accent-gold border border-accent-gold/30' : 'bg-gray-800 text-gray-500'">
                    {{ isLastRow(row) && hasBalloon() ? 'BALON' : (row.graceType || 'NONE') }}
                  </span>
                </td>
              </tr>
              <!-- Totals -->
              <tr class="bg-dark-input/20 font-bold border-t border-dark-border text-white text-xs select-none">
                <td colspan="3" class="px-4 py-4 text-right uppercase tracking-wider">Totales</td>
                <td class="px-4 py-4 text-yellow-600/90">{{ formatCurrencySymbol() }} {{ formatMoney(result?.totalInterest) }}</td>
                <td class="px-4 py-4">-</td>
                <td colspan="2" class="px-4 py-4">{{ formatCurrencySymbol() }} {{ formatMoney(result?.totalInsurance) }}</td>
                <td class="px-4 py-4 text-brand-text">{{ formatCurrencySymbol() }} {{ formatMoney(result?.totalPayment) }}</td>
                <td colspan="3" class="px-4 py-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex justify-start">
        <button type="button" (click)="onNewSimulation()" class="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 border border-dark-border text-gray-300 font-semibold text-xs rounded-lg transition duration-150">Nueva Simulacion</button>
      </div>
    </div>
  `
})
export class SimulationScheduleComponent {
  @Input() result!: any;
  @Input() customerName = '';
  @Output() viewIndicators = new EventEmitter<void>();
  @Output() newSimulation = new EventEmitter<void>();

  getCustomerName(): string { return this.customerName || 'Cliente'; }
  getSchedule(): PaymentRow[] { return this.result?.schedule || []; }
  hasBalloon(): boolean { return this.result?.balloonAmount > 0; }
  isLastRow(row: PaymentRow): boolean { return row.period === this.result?.termMonths; }

  onViewIndicators() { this.viewIndicators.emit(); }
  onNewSimulation() { this.newSimulation.emit(); }
  exportPDF() { window.print(); }

  formatCurrencySymbol(): string { return this.result?.currency === 'USD' ? 'USD' : 'S/'; }
  formatMoney(val: any): string { if (val == null) return '0.00'; return new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(val)); }
  formatPercent7(val: any): string { if (val == null) return '0.0000000'; return Number(val).toFixed(7); }
}