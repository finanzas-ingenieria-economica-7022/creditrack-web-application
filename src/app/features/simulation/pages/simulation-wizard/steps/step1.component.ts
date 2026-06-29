import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Customer } from '../../../../../core/services/customer.service';
import { Vehicle } from '../../../../../core/services/vehicle.service';

@Component({
  selector: 'app-simulation-step1',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div [formGroup]="parentForm" class="space-y-6">
      <div class="bg-dark-card border border-dark-border rounded-xl p-6 space-y-6">
        
        <!-- Customer & Vehicle Selection -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- CLIENTE -->
          <div>
            <label class="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">Cliente</label>
            <select
              formControlName="customerId"
              (change)="onCustomerChange()"
              class="w-full px-4 py-3 bg-dark-input border border-dark-border rounded-lg text-white focus:outline-none focus:border-brand-primary text-sm transition duration-150 cursor-pointer"
            >
              <option [value]="null" disabled selected>Seleccionar cliente</option>
              <option *ngFor="let cust of customers" [value]="cust.id">
                {{ cust.firstName }} {{ cust.lastName }} (DNI: {{ cust.documentNumber }})
              </option>
            </select>
          </div>

          <!-- VEHÍCULO -->
          <div>
            <label class="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">Vehículo</label>
            <select
              formControlName="vehicleId"
              (change)="onVehicleChange()"
              class="w-full px-4 py-3 bg-dark-input border border-dark-border rounded-lg text-white focus:outline-none focus:border-brand-primary text-sm transition duration-150 cursor-pointer"
            >
              <option [value]="null" disabled selected>Seleccionar vehículo</option>
              <option *ngFor="let veh of vehicles" [value]="veh.id">
                {{ veh.brand }} {{ veh.model }} ({{ formatCurrencySymbol() }} {{ formatNumber(veh.price) }})
              </option>
            </select>
          </div>
        </div>

        <!-- Dynamic Info Alert Card -->
        <div *ngIf="selectedCustomerText && selectedVehicleText" class="bg-blue-950/20 border border-blue-600/30 rounded-lg p-4 text-brand-text flex items-center space-x-3 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-brand-text flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          <span class="font-medium text-blue-200">
            {{ selectedCustomerText }} — {{ selectedVehicleText }} ({{ formatCurrencySymbol() }} {{ formatNumber(vehiclePrice) }})
          </span>
        </div>

        <!-- MONEDA -->
        <div>
          <label class="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">Moneda</label>
          <div class="flex space-x-2 bg-dark-input border border-dark-border rounded-lg p-1 w-64">
            <button
              type="button"
              (click)="setCurrency('PEN')"
              class="flex-1 py-1.5 rounded-md text-xs font-bold transition duration-150"
              [ngClass]="parentForm.get('currency')?.value === 'PEN' ? 'bg-brand-primary text-white' : 'text-gray-400 hover:text-white'"
            >
              Soles (S/)
            </button>
            <button
              type="button"
              (click)="setCurrency('USD')"
              class="flex-1 py-1.5 rounded-md text-xs font-bold transition duration-150"
              [ngClass]="parentForm.get('currency')?.value === 'USD' ? 'bg-brand-primary text-white' : 'text-gray-400 hover:text-white'"
            >
              Dólares (USD)
            </button>
          </div>
        </div>

        <!-- Prices Row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <!-- PRECIO DEL VEHÍCULO -->
          <div>
            <label class="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">Precio del Vehículo</label>
            <div class="relative flex items-center">
              <span class="absolute left-3.5 text-gray-500 font-medium text-sm">{{ formatCurrencySymbol() }}</span>
              <input
                type="text"
                [value]="formatNumber(vehiclePrice)"
                readonly
                class="w-full pl-9 pr-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-gray-400 focus:outline-none text-sm font-semibold select-none cursor-not-allowed"
              />
            </div>
          </div>

          <!-- CUOTA INICIAL -->
          <div>
            <label class="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">Cuota Inicial</label>
            <div class="relative flex items-center">
              <span class="absolute left-3.5 text-gray-500 font-medium text-sm">%</span>
              <input
                type="number"
                formControlName="initialPaymentPercentage"
                (input)="calculateInitialPayment()"
                placeholder="20"
                class="w-full pl-9 pr-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-white focus:outline-none focus:border-brand-primary text-sm font-semibold transition duration-150"
              />
            </div>
            <!-- Calculated value text -->
            <div class="text-[11px] text-gray-500 mt-1 font-medium text-right">
              = {{ formatCurrencySymbol() }} {{ formatNumber(initialPaymentAmount) }}
            </div>
          </div>

          <!-- MONTO A FINANCIAR -->
          <div>
            <label class="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">Monto a Financiar</label>
            <div class="relative flex items-center">
              <span class="absolute left-3.5 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                type="text"
                [value]="formatCurrencySymbol() + ' ' + formatNumber(amountToFinance)"
                readonly
                class="w-full pl-10 pr-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-gray-400 focus:outline-none text-sm font-bold select-none cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <hr class="border-dark-border" />

        <!-- PLAZO (MESES) Slider -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-semibold text-gray-400 tracking-wider uppercase">Plazo (Meses)</label>
            <div class="px-3 py-1 bg-gray-800 border border-dark-border rounded-md text-white font-bold text-sm">
              {{ parentForm.get('termMonths')?.value }}
            </div>
          </div>

          <div class="space-y-2">
            <input
              type="range"
              formControlName="termMonths"
              min="12"
              max="72"
              step="12"
              class="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-brand-primary"
            />
            <div class="flex justify-between text-[10px] text-gray-600 font-bold px-1 select-none">
              <span>12</span>
              <span>24</span>
              <span>36</span>
              <span>48</span>
              <span>60</span>
              <span>72</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Action buttons -->
      <div class="flex justify-end pt-4">
        <button
          type="button"
          (click)="onNext()"
          [disabled]="isInvalid()"
          class="px-6 py-3 bg-brand-primary hover:bg-brand-hover text-white font-bold text-sm rounded-lg flex items-center space-x-2 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
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
export class SimulationStep1Component {
  @Input() parentForm!: FormGroup;
  @Input() customers: Customer[] = [];
  @Input() vehicles: Vehicle[] = [];
  @Output() next = new EventEmitter<void>();

  selectedCustomerText = '';
  selectedVehicleText = '';
  vehiclePrice = 0;
  initialPaymentAmount = 0;
  amountToFinance = 0;

  onCustomerChange() {
    const custId = Number(this.parentForm.get('customerId')?.value);
    const customer = this.customers.find(c => c.id === custId);
    if (customer) {
      this.selectedCustomerText = `${customer.firstName} ${customer.lastName}`;
    }
  }

  onVehicleChange() {
    const vehId = Number(this.parentForm.get('vehicleId')?.value);
    const vehicle = this.vehicles.find(v => v.id === vehId);
    if (vehicle) {
      this.selectedVehicleText = `${vehicle.brand} ${vehicle.model}`;
      this.vehiclePrice = vehicle.price;
      this.parentForm.get('vehiclePrice')?.setValue(vehicle.price);
      this.calculateInitialPayment();
    }
  }

  setCurrency(curr: 'PEN' | 'USD') {
    this.parentForm.get('currency')?.setValue(curr);
  }

  calculateInitialPayment() {
    const pct = this.parentForm.get('initialPaymentPercentage')?.value || 0;
    this.initialPaymentAmount = (this.vehiclePrice * pct) / 100;
    this.amountToFinance = Math.max(0, this.vehiclePrice - this.initialPaymentAmount);
  }

  isInvalid(): boolean {
    return (
      !this.parentForm.get('customerId')?.value ||
      !this.parentForm.get('vehicleId')?.value ||
      !this.parentForm.get('initialPaymentPercentage')?.value
    );
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
