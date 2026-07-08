import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-simulation-step2',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div [formGroup]="parentForm" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Left Column: Rates & Grace -->
        <div class="lg:col-span-2 space-y-6">

          <!-- TASA Panel -->
          <div class="bg-dark-card border border-dark-border rounded-xl p-6 space-y-6">
            <h3 class="text-xs font-semibold text-gray-500 tracking-wider uppercase">Tasa de Interes (TEA)</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase mb-2">TEA (%)</label>
                <input type="number" formControlName="teaPercent" step="0.01"
                  class="w-full px-3 py-2.5 bg-dark-input border border-dark-border rounded-lg text-white font-semibold focus:outline-none focus:border-brand-primary text-sm" />
                <div class="text-[10px] text-gray-500 mt-1">TEM Equivalente: <span class="text-accent-gold font-bold">{{ calculateTem() }}%</span></div>
              </div>
              <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase mb-2">COK / WACC (%)</label>
                <input type="number" formControlName="cokTeaPercent" step="0.01"
                  class="w-full px-3 py-2.5 bg-dark-input border border-dark-border rounded-lg text-white font-semibold focus:outline-none focus:border-brand-primary text-sm" />
                <span class="text-[9px] text-gray-500 mt-1 block">Tasa de descuento para VAN. Debe ser mayor a la TEA.</span>
              </div>
            </div>
          </div>

          <!-- PERIODO DE GRACIA Panel -->
          <div class="bg-dark-card border border-dark-border rounded-xl p-6 space-y-4">
            <h3 class="text-xs font-semibold text-gray-500 tracking-wider uppercase">Periodo de Gracia</h3>
            <div class="grid grid-cols-3 gap-4">
              <button type="button" (click)="setGraceType('NONE')"
                class="border rounded-xl p-4 flex flex-col items-center justify-center space-y-2 hover:bg-gray-800/10 transition duration-150"
                [ngClass]="parentForm.get('graceType')?.value === 'NONE' ? 'border-brand-primary bg-brand-primary/5 text-white' : 'border-dark-border text-gray-400 hover:text-white'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                <span class="text-xs font-semibold">Sin gracia</span>
              </button>
              <button type="button" (click)="setGraceType('PARTIAL')"
                class="border rounded-xl p-4 flex flex-col items-center justify-center space-y-2 hover:bg-gray-800/10 transition duration-150"
                [ngClass]="parentForm.get('graceType')?.value === 'PARTIAL' ? 'border-brand-primary bg-brand-primary/5 text-white' : 'border-dark-border text-gray-400 hover:text-white'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span class="text-xs font-semibold">Parcial</span>
              </button>
              <button type="button" (click)="setGraceType('TOTAL')"
                class="border rounded-xl p-4 flex flex-col items-center justify-center space-y-2 hover:bg-gray-800/10 transition duration-150"
                [ngClass]="parentForm.get('graceType')?.value === 'TOTAL' ? 'border-brand-primary bg-brand-primary/5 text-white' : 'border-dark-border text-gray-400 hover:text-white'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-xs font-semibold">Total</span>
              </button>
            </div>
            <div *ngIf="parentForm.get('graceType')?.value !== 'NONE'" class="mt-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase mb-2">Meses de gracia</label>
              <input type="number" formControlName="graceMonths" min="1" max="24"
                class="w-32 px-3 py-2 bg-dark-input border border-dark-border rounded-lg text-white font-semibold focus:outline-none focus:border-brand-primary text-sm" />
            </div>
          </div>

          <!-- SEGUROS Panel -->
          <div class="bg-dark-card border border-dark-border rounded-xl p-6 space-y-4">
            <h3 class="text-xs font-semibold text-gray-500 tracking-wider uppercase">Seguros Mensuales</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase mb-2">Desgravamen (%/mes sobre saldo)</label>
                <input type="number" formControlName="creditLifeInsuranceMonthlyPercent" step="0.001"
                  class="w-full px-3 py-2 bg-dark-input border border-dark-border rounded-lg text-white font-semibold focus:outline-none focus:border-brand-primary text-sm" />
              </div>
              <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase mb-2">Vehicular (%/anual sobre precio)</label>
                <input type="number" formControlName="vehicleInsuranceAnnualPercent" step="0.01"
                  class="w-full px-3 py-2 bg-dark-input border border-dark-border rounded-lg text-white font-semibold focus:outline-none focus:border-brand-primary text-sm" />
              </div>
            </div>
          </div>

        </div>

        <!-- Right Column: Balloon Payment -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-6 flex flex-col justify-between h-full">
          <div>
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xs font-semibold text-gray-500 tracking-wider uppercase">Cuota Balon</h3>
            </div>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-gray-400">Porcentaje (%)</span>
                <div class="px-3 py-1 bg-gray-800 border border-dark-border rounded-md text-white font-bold text-sm">{{ parentForm.get('balloonPercent')?.value }}%</div>
              </div>
              <div class="space-y-1">
                <input type="range" formControlName="balloonPercent" min="0" max="60" step="5"
                  class="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-brand-primary" />
                <div class="flex justify-between text-[10px] text-gray-600 font-bold px-1 select-none">
                  <span>0%</span><span>60%</span>
                </div>
              </div>
            </div>
            <div class="mt-8 bg-dark-input/40 border border-dark-border rounded-lg p-5 text-center space-y-1">
              <span class="text-[10px] text-gray-500 font-bold tracking-wider uppercase">Monto de Cuota Balon:</span>
              <div class="text-xl font-bold text-accent-gold">{{ formatCurrencySymbol() }} {{ formatNumber(calculateBalloonAmount()) }}</div>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-8 leading-relaxed">
            El porcentaje se aplica sobre el <strong class="text-gray-300">Monto a Financiar</strong> (precio del vehículo menos la cuota inicial). Este monto adicional se pagará en la última cuota del cronograma.
          </p>
        </div>

      </div>

      <!-- Action buttons -->
      <div class="flex justify-between pt-4 border-t border-dark-border">
        <button type="button" (click)="onBack()"
          class="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-dark-border text-gray-300 font-bold text-sm rounded-lg flex items-center space-x-2 transition duration-150">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
          <span>Anterior</span>
        </button>
        <button type="button" (click)="onNext()" [disabled]="isInvalid()"
          class="px-6 py-3 bg-brand-primary hover:bg-brand-hover text-white font-bold text-sm rounded-lg flex items-center space-x-2 transition duration-150 disabled:opacity-50">
          <span>Siguiente</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  `
})
export class SimulationStep2Component implements OnInit {
  @Input() parentForm!: FormGroup;
  @Output() prev = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  ngOnInit() {}

  setGraceType(type: 'NONE' | 'PARTIAL' | 'TOTAL') {
    this.parentForm.get('graceType')?.setValue(type);
    if (type === 'NONE') this.parentForm.get('graceMonths')?.setValue(0);
    else if (!this.parentForm.get('graceMonths')?.value) this.parentForm.get('graceMonths')?.setValue(3);
  }

  calculateTem(): string {
    const tea = this.parentForm.get('teaPercent')?.value || 0;
    if (tea === 0) return '0.0000';
    const tem = Math.pow(1 + tea / 100, 1 / 12) - 1;
    return (tem * 100).toFixed(4);
  }

  calculateBalloonAmount(): number {
    const price: number = this.parentForm.get('vehiclePrice')?.value || 0;
    const downPct: number = this.parentForm.get('downPaymentPercent')?.value || 0;
    const balloonPct: number = this.parentForm.get('balloonPercent')?.value || 0;
    // Regla de negocio: el balón se calcula sobre el MONTO A FINANCIAR,
    // definido como el precio del vehículo menos la cuota inicial.
    const downPaymentAmount: number = price * (downPct / 100);
    const financedAmount: number = price - downPaymentAmount;
    return (financedAmount * balloonPct) / 100;
  }

  isInvalid(): boolean {
    return !this.parentForm.get('teaPercent')?.value
      || !this.parentForm.get('cokTeaPercent')?.value
      || this.parentForm.get('creditLifeInsuranceMonthlyPercent')?.value === null
      || this.parentForm.get('vehicleInsuranceAnnualPercent')?.value === null;
  }

  onBack() { this.prev.emit(); }
  onNext() { if (!this.isInvalid()) this.next.emit(); }

  formatCurrencySymbol(): string { return this.parentForm.get('currency')?.value === 'USD' ? 'USD' : 'S/'; }
  formatNumber(val: number): string { return new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val); }
}