import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { Customer } from '../../../../../core/services/customer.service';
import { Vehicle } from '../../../../../core/services/vehicle.service';

@Component({
  selector: 'app-simulation-step3',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      
      <!-- Split summary layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Summary details (Colspan 2) -->
        <div class="lg:col-span-2 bg-dark-card border border-dark-border rounded-xl p-6 space-y-6">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4 border-b border-dark-border pb-6">
            <!-- CLIENTE -->
            <div>
              <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Cliente</span>
              <span class="text-white font-semibold text-sm">{{ getCustomerName() }}</span>
            </div>

            <!-- VEHÍCULO -->
            <div>
              <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Vehículo</span>
              <span class="text-white font-semibold text-sm">{{ getVehicleName() }}</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4 border-b border-dark-border pb-6">
            <!-- PRECIO -->
            <div>
              <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Precio</span>
              <span class="text-white font-semibold text-sm">{{ formatCurrencySymbol() }} {{ formatNumber(getVehiclePrice()) }}</span>
            </div>

            <!-- CUOTA INICIAL -->
            <div>
              <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Cuota Inicial</span>
              <span class="text-white font-semibold text-sm">
                {{ formatCurrencySymbol() }} {{ formatNumber(getInitialPaymentAmount()) }} ({{ parentForm.get('downPaymentPercent')?.value }}%)
              </span>
            </div>

            <!-- MONTO A FINANCIAR -->
            <div>
              <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Monto a Financiar</span>
              <span class="text-white font-bold text-sm">{{ formatCurrencySymbol() }} {{ formatNumber(getAmountToFinance()) }}</span>
            </div>

            <!-- MONEDA -->
            <div>
              <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Moneda</span>
              <span class="text-white font-semibold text-sm">{{ parentForm.get('currency')?.value === 'USD' ? 'Dólares (USD)' : 'Soles (S/)' }}</span>
            </div>
          </div>

          <!-- Highlight boxes (Rates & Balloon) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- TIPO DE TASA & TEM -->
            <div class="border border-yellow-600/20 bg-yellow-950/5 rounded-xl p-5 flex flex-col justify-between h-28">
              <div>
                <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Tipo de Tasa</span>
                <span class="text-white font-bold text-sm">
                  {{ parentForm.get('teaPercent')?.value }} — {{ parentForm.get('teaPercent')?.value }}%
                </span>
              </div>
              <div>
                <span class="text-[10px] text-gray-500 font-medium">TEM Calculada</span>
                <div class="text-base font-bold text-accent-gold">{{ calculateTemFromTea() }}%</div>
              </div>
            </div>

            <!-- PLAZO & CUOTA BALÓN -->
            <div class="border border-yellow-600/20 bg-yellow-950/5 rounded-xl p-5 flex flex-col justify-between h-28">
              <div>
                <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Plazo</span>
                <span class="text-white font-bold text-sm">{{ parentForm.get('termMonths')?.value }} meses</span>
              </div>
              <div>
                <span class="text-[10px] text-gray-500 font-medium">Cuota Balón</span>
                <div class="text-base font-bold text-accent-gold">
                  {{ parentForm.get('balloonPercent')?.value }}% = {{ formatCurrencySymbol() }} {{ formatNumber(calculateBalloonAmount()) }}
                </div>
              </div>
            </div>
          </div>

          <!-- CARGOS MENSUALES -->
          <div class="pt-2">
            <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Cargos Mensuales</span>
            <span class="text-gray-300 text-xs">
              Desgravamen ({{ parentForm.get('desgravamenRate')?.value }}%), 
              Seg. Vehicular ({{ formatCurrencySymbol() }} {{ formatNumber(parentForm.get('riskInsuranceRate')?.value) }}), 
              Portes ({{ formatCurrencySymbol() }} {{ formatNumber(parentForm.get('portesFee')?.value) }})
            </span>
          </div>

        </div>

        <!-- Call to action card (Right) -->
        <div class="border border-brand-primary bg-blue-950/5 rounded-xl p-6 flex flex-col justify-between h-full min-h-[300px]">
          <div class="space-y-4">
            <div class="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <p class="text-sm font-semibold text-blue-200 leading-relaxed">
              Todo listo. Se generará el cronograma de pagos basado en estos parámetros.
            </p>
          </div>

          <button
            type="button"
            (click)="onCalculate()"
            [disabled]="loading"
            class="w-full py-3 bg-brand-primary hover:bg-brand-hover text-white font-bold rounded-lg transition duration-150 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <div *ngIf="loading" class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-1"></div>
            <span>Calcular simulación</span>
          </button>
        </div>

      </div>

      <!-- Action buttons -->
      <div class="flex justify-start pt-4 border-t border-dark-border">
        <button
          type="button"
          (click)="onBack()"
          [disabled]="loading"
          class="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-dark-border text-gray-300 font-bold text-sm rounded-lg flex items-center space-x-2 transition duration-150 disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Anterior</span>
        </button>
      </div>
    </div>
  `
})
export class SimulationStep3Component {
  @Input() parentForm!: FormGroup;
  @Input() customers: Customer[] = [];
  @Input() vehicles: Vehicle[] = [];
  @Input() loading = false;
  @Output() prev = new EventEmitter<void>();
  @Output() calculate = new EventEmitter<void>();

  getCustomerName(): string {
    const id = Number(this.parentForm.get('customerId')?.value);
    const customer = this.customers.find(c => c.id === id);
    return customer ? `${customer.firstName} ${customer.lastName}` : 'No seleccionado';
  }

  getVehicleName(): string {
    const id = Number(this.parentForm.get('vehicleId')?.value);
    const vehicle = this.vehicles.find(v => v.id === id);
    return vehicle ? `${vehicle.brand} ${vehicle.model}` : 'No seleccionado';
  }

  getVehiclePrice(): number {
    const id = Number(this.parentForm.get('vehicleId')?.value);
    const vehicle = this.vehicles.find(v => v.id === id);
    return vehicle ? vehicle.price : 0;
  }

  getInitialPaymentAmount(): number {
    const price = this.getVehiclePrice();
    const pct = this.parentForm.get('downPaymentPercent')?.value || 0;
    return (price * pct) / 100;
  }

  getAmountToFinance(): number {
    return this.getVehiclePrice() - this.getInitialPaymentAmount();
  }

  calculateTemFromTea(): string {
    const rate = this.parentForm.get('teaPercent')?.value || 0;
    const type = this.parentForm.get('teaPercent')?.value;
    if (type === 'TNA') {
      // Nominal rate daily capitalization TEM approximation
      const tna = rate / 100;
      const tem = Math.pow(1 + tna / 360, 30) - 1;
      return (tem * 100).toFixed(4);
    }
    const tea = rate / 100;
    const tem = Math.pow(1 + tea, 30 / 360) - 1;
    return (tem * 100).toFixed(4);
  }

  calculateBalloonAmount(): number {
    const financedBase = this.getAmountToFinance();
    const balloonPct = this.parentForm.get('balloonPercent')?.value || 0;
    return (financedBase * balloonPct) / 100;
  }

  onBack() {
    this.prev.emit();
  }

  onCalculate() {
    this.calculate.emit();
  }

  formatCurrencySymbol(): string {
    return this.parentForm.get('currency')?.value === 'USD' ? 'USD' : 'S/';
  }

  formatNumber(val: number): string {
    return new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
  }
}
