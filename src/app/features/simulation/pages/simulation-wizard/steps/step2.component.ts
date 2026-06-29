import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-simulation-step2',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div [formGroup]="parentForm" class="space-y-6">
      
      <!-- Split Layout Columns -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left Column: Rates & Grace (Colspan 2) -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- TIPO DE TASA Panel -->
          <div class="bg-dark-card border border-dark-border rounded-xl p-6 space-y-6">
            <h3 class="text-xs font-semibold text-gray-500 tracking-wider uppercase">Tipo de Tasa</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Effective Rate Box -->
              <div
                (click)="setRateType('TEA')"
                class="border rounded-xl p-5 cursor-pointer transition duration-150 flex flex-col justify-between h-44"
                [ngClass]="parentForm.get('interestRateType')?.value === 'TEA' ? 'border-brand-primary bg-brand-primary/5' : 'border-dark-border hover:border-gray-700 bg-dark-input/20'"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-white font-bold text-sm">Tasa Efectiva</h4>
                    <span class="text-[10px] text-gray-500">TEA / TEM / TED</span>
                  </div>
                  <div class="w-4 h-4 rounded-full border border-gray-500 flex items-center justify-center">
                    <div *ngIf="parentForm.get('interestRateType')?.value === 'TEA'" class="w-2.5 h-2.5 rounded-full bg-brand-primary"></div>
                  </div>
                </div>

                <div *ngIf="parentForm.get('interestRateType')?.value === 'TEA'" class="space-y-2 mt-4" (click)="$event.stopPropagation()">
                  <label class="block text-[10px] font-bold text-gray-400 uppercase">TEA (%)</label>
                  <input
                    type="number"
                    formControlName="interestRate"
                    class="w-full px-3 py-2 bg-dark-input border border-dark-border rounded-lg text-white font-semibold focus:outline-none focus:border-brand-primary text-sm"
                  />
                  <!-- Calculated TEM -->
                  <div class="text-[10px] text-gray-500">
                    TEM Equivalente: <span class="text-accent-gold font-bold">{{ calculateTemFromTea() }}%</span>
                  </div>
                </div>
              </div>

              <!-- Nominal Rate Box -->
              <div
                (click)="setRateType('TNA')"
                class="border rounded-xl p-5 cursor-pointer transition duration-150 flex flex-col justify-between h-44"
                [ngClass]="parentForm.get('interestRateType')?.value === 'TNA' ? 'border-brand-primary bg-brand-primary/5' : 'border-dark-border hover:border-gray-700 bg-dark-input/20'"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-white font-bold text-sm">Tasa Nominal</h4>
                    <span class="text-[10px] text-gray-500">TNA / TNM / TND</span>
                  </div>
                  <div class="w-4 h-4 rounded-full border border-gray-500 flex items-center justify-center">
                    <div *ngIf="parentForm.get('interestRateType')?.value === 'TNA'" class="w-2.5 h-2.5 rounded-full bg-brand-primary"></div>
                  </div>
                </div>

                <div *ngIf="parentForm.get('interestRateType')?.value === 'TNA'" class="space-y-3 mt-4" (click)="$event.stopPropagation()">
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">TNA (%)</label>
                      <input
                        type="number"
                        formControlName="interestRate"
                        class="w-full px-3 py-2 bg-dark-input border border-dark-border rounded-lg text-white font-semibold focus:outline-none focus:border-brand-primary text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Capitalización</label>
                      <select
                        formControlName="capitalizationType"
                        class="w-full px-3 py-2 bg-dark-input border border-dark-border rounded-lg text-white focus:outline-none focus:border-brand-primary text-sm cursor-pointer"
                      >
                        <option value="Diaria">Diaria</option>
                        <option value="Mensual">Mensual</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- PERIODO DE GRACIA Panel -->
          <div class="bg-dark-card border border-dark-border rounded-xl p-6 space-y-4">
            <h3 class="text-xs font-semibold text-gray-500 tracking-wider uppercase">Periodo de Gracia</h3>

            <div class="grid grid-cols-3 gap-4">
              <!-- Sin gracia ("S") -->
              <button
                type="button"
                (click)="setGracePeriod('S')"
                class="border rounded-xl p-4 flex flex-col items-center justify-center space-y-2 hover:bg-gray-800/10 transition duration-150"
                [ngClass]="parentForm.get('graceType')?.value === 'S' ? 'border-brand-primary bg-brand-primary/5 text-white' : 'border-dark-border text-gray-400 hover:text-white'"
              >
                <!-- Prohibition slash icon -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                <span class="text-xs font-semibold">Sin gracia</span>
              </button>

              <!-- Parcial ("P") -->
              <button
                type="button"
                (click)="setGracePeriod('P')"
                class="border rounded-xl p-4 flex flex-col items-center justify-center space-y-2 hover:bg-gray-800/10 transition duration-150"
                [ngClass]="parentForm.get('graceType')?.value === 'P' ? 'border-brand-primary bg-brand-primary/5 text-white' : 'border-dark-border text-gray-400 hover:text-white'"
              >
                <!-- Partial/half moon icon -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span class="text-xs font-semibold">Parcial</span>
              </button>

              <!-- Total ("T") -->
              <button
                type="button"
                (click)="setGracePeriod('T')"
                class="border rounded-xl p-4 flex flex-col items-center justify-center space-y-2 hover:bg-gray-800/10 transition duration-150"
                [ngClass]="parentForm.get('graceType')?.value === 'T' ? 'border-brand-primary bg-brand-primary/5 text-white' : 'border-dark-border text-gray-400 hover:text-white'"
              >
                <!-- Calendar icon -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-xs font-semibold">Total</span>
              </button>
            </div>
          </div>

          <!-- CARGOS Y SEGUROS Panel -->
          <div class="bg-dark-card border border-dark-border rounded-xl p-6 space-y-4">
            <h3 class="text-xs font-semibold text-gray-500 tracking-wider uppercase">Cargos y Seguros (Cálculo TCEA)</h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Seguro de Desgravamen -->
              <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase mb-2">Seguro de Desgravamen (%)</label>
                <input
                  type="number"
                  formControlName="desgravamenRate"
                  step="0.001"
                  class="w-full px-3 py-2 bg-dark-input border border-dark-border rounded-lg text-white font-semibold focus:outline-none focus:border-brand-primary text-sm"
                />
                <span class="text-[9px] text-gray-500 mt-1 block">Cobro mensual sobre el saldo.</span>
              </div>

              <!-- Seguro Vehicular -->
              <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase mb-2">Seguro Vehicular</label>
                <input
                  type="number"
                  formControlName="riskInsuranceRate"
                  class="w-full px-3 py-2 bg-dark-input border border-dark-border rounded-lg text-white font-semibold focus:outline-none focus:border-brand-primary text-sm"
                />
                <span class="text-[9px] text-gray-500 mt-1 block">Cargo mensual fijo.</span>
              </div>

              <!-- Portes -->
              <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase mb-2">Portes</label>
                <input
                  type="number"
                  formControlName="portesFee"
                  class="w-full px-3 py-2 bg-dark-input border border-dark-border rounded-lg text-white font-semibold focus:outline-none focus:border-brand-primary text-sm"
                />
                <span class="text-[9px] text-gray-500 mt-1 block">Cargo mensual fijo.</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Right Column: Balloon Payment Panel (Colspan 1) -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-6 flex flex-col justify-between h-full">
          <div>
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xs font-semibold text-gray-500 tracking-wider uppercase">Cuota Balón</h3>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <!-- Balloon percentage slider -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-gray-400">Porcentaje (%)</span>
                <div class="px-3 py-1 bg-gray-800 border border-dark-border rounded-md text-white font-bold text-sm">
                  {{ parentForm.get('finalPaymentPercentage')?.value }}%
                </div>
              </div>

              <div class="space-y-1">
                <input
                  type="range"
                  formControlName="finalPaymentPercentage"
                  min="0"
                  max="100"
                  step="5"
                  class="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
                <div class="flex justify-between text-[10px] text-gray-600 font-bold px-1 select-none">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            <!-- Balloon calculated cash panel -->
            <div class="mt-8 bg-dark-input/40 border border-dark-border rounded-lg p-5 text-center space-y-1">
              <span class="text-[10px] text-gray-500 font-bold tracking-wider uppercase">Monto de Cuota Balón:</span>
              <div class="text-xl font-bold text-accent-gold">
                {{ formatCurrencySymbol() }} {{ formatNumber(calculateBalloonAmount()) }}
              </div>
            </div>
          </div>

          <p class="text-xs text-gray-500 mt-8 leading-relaxed">
            El porcentaje se calcula sobre el saldo a financiar. Este monto se pagará en la última cuota del cronograma.
          </p>
        </div>

      </div>

      <!-- Action buttons -->
      <div class="flex justify-between pt-4 border-t border-dark-border">
        <button
          type="button"
          (click)="onBack()"
          class="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-dark-border text-gray-300 font-bold text-sm rounded-lg flex items-center space-x-2 transition duration-150"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Anterior</span>
        </button>
        <button
          type="button"
          (click)="onNext()"
          [disabled]="isInvalid()"
          class="px-6 py-3 bg-brand-primary hover:bg-brand-hover text-white font-bold text-sm rounded-lg flex items-center space-x-2 transition duration-150 disabled:opacity-50"
        >
          <span>Siguiente</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  `
})
export class SimulationStep2Component implements OnInit {
  @Input() parentForm!: FormGroup;
  @Output() prev = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  ngOnInit() {
    // Standard initialization if fields are empty
    if (!this.parentForm.get('desgravamenRate')?.value) {
      this.parentForm.get('desgravamenRate')?.setValue(0.050);
    }
    if (!this.parentForm.get('riskInsuranceRate')?.value) {
      this.parentForm.get('riskInsuranceRate')?.setValue(80.00);
    }
    if (!this.parentForm.get('portesFee')?.value) {
      this.parentForm.get('portesFee')?.setValue(10.00);
    }
  }

  setRateType(type: 'TEA' | 'TNA') {
    this.parentForm.get('interestRateType')?.setValue(type);
    if (type === 'TEA') {
      this.parentForm.get('capitalizationType')?.setValue(null);
    } else {
      this.parentForm.get('capitalizationType')?.setValue('Diaria');
    }
  }

  setGracePeriod(type: 'S' | 'P' | 'T') {
    this.parentForm.get('graceType')?.setValue(type);
  }

  calculateTemFromTea(): string {
    const tea = this.parentForm.get('interestRate')?.value || 0;
    if (tea === 0) return '0.0000';
    // TEM = (1 + TEA/100)^(30/360) - 1
    const tem = Math.pow(1 + tea / 100, 30 / 360) - 1;
    return (tem * 100).toFixed(4);
  }

  calculateBalloonAmount(): number {
    const price = this.parentForm.get('vehiclePrice')?.value || 0;
    const initialPct = this.parentForm.get('initialPaymentPercentage')?.value || 0;
    const balloonPct = this.parentForm.get('finalPaymentPercentage')?.value || 0;

    const financedBase = price * (1 - initialPct / 100);
    return (financedBase * balloonPct) / 100;
  }

  isInvalid(): boolean {
    return (
      !this.parentForm.get('interestRate')?.value ||
      this.parentForm.get('desgravamenRate')?.value === null ||
      this.parentForm.get('riskInsuranceRate')?.value === null ||
      this.parentForm.get('portesFee')?.value === null
    );
  }

  onBack() {
    this.prev.emit();
  }

  onNext() {
    if (!this.isInvalid()) {
      this.next.emit();
    }
  }

  formatCurrencySymbol(): string {
    return this.parentForm.get('currency')?.value === 'USD' ? 'USD' : 'S/';
  }

  formatNumber(val: number): string {
    return new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
  }
}
