import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomerService, Customer } from '../../../../core/services/customer.service';
import { VehicleService, Vehicle } from '../../../../core/services/vehicle.service';
import { FinancialEntityService, FinancialEntity } from '../../../../core/services/financial-entity.service';
import { SimulationService, SimulationRequestPayload } from '../../../../core/services/simulation.service';
import { SimulationStep1Component } from './steps/step1.component';
import { SimulationStep2Component } from './steps/step2.component';
import { SimulationStep3Component } from './steps/step3.component';
import { SimulationScheduleComponent } from './results/schedule.component';
import { SimulationIndicatorsComponent } from './results/indicators.component';

@Component({
  selector: 'app-simulation-wizard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SimulationStep1Component,
    SimulationStep2Component,
    SimulationStep3Component,
    SimulationScheduleComponent,
    SimulationIndicatorsComponent
  ],
  template: `
    <div class="space-y-6">
      
      <!-- Step Tracker Header -->
      <div *ngIf="currentStep <= 3" class="max-w-3xl mx-auto py-4">
        <div class="relative flex items-center justify-between">
          <!-- Connector line -->
          <div class="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-800 z-0"></div>
          <div
            class="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-brand-primary z-0 transition-all duration-300"
            [style.width.%]="getConnectorWidth()"
          ></div>

          <!-- Step 1 -->
          <div class="flex flex-col items-center z-10">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition duration-300"
              [ngClass]="currentStep >= 1 ? 'bg-brand-primary text-white' : 'bg-gray-900 border border-dark-border text-gray-500'"
            >
              1
            </div>
            <span class="text-[10px] font-bold uppercase tracking-wider mt-2 transition duration-300" [ngClass]="currentStep >= 1 ? 'text-brand-text' : 'text-gray-500'">
              Datos
            </span>
          </div>

          <!-- Step 2 -->
          <div class="flex flex-col items-center z-10">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition duration-300"
              [ngClass]="currentStep >= 2 ? 'bg-brand-primary text-white' : 'bg-gray-900 border border-dark-border text-gray-500'"
            >
              2
            </div>
            <span class="text-[10px] font-bold uppercase tracking-wider mt-2 transition duration-300" [ngClass]="currentStep >= 2 ? 'text-brand-text' : 'text-gray-500'">
              Configuración
            </span>
          </div>

          <!-- Step 3 -->
          <div class="flex flex-col items-center z-10">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition duration-300"
              [ngClass]="currentStep >= 3 ? 'bg-brand-primary text-white' : 'bg-gray-900 border border-dark-border text-gray-500'"
            >
              3
            </div>
            <span class="text-[10px] font-bold uppercase tracking-wider mt-2 transition duration-300" [ngClass]="currentStep >= 3 ? 'text-brand-text' : 'text-gray-500'">
              Resumen
            </span>
          </div>
        </div>
      </div>

      <!-- Main Step Render Container -->
      <div class="max-w-6xl mx-auto">
        <app-simulation-step1
          *ngIf="currentStep === 1"
          [parentForm]="simulationForm"
          [customers]="customers"
          [vehicles]="vehicles"
          (next)="nextStep()"
        ></app-simulation-step1>

        <app-simulation-step2
          *ngIf="currentStep === 2"
          [parentForm]="simulationForm"
          (prev)="prevStep()"
          (next)="nextStep()"
        ></app-simulation-step2>

        <app-simulation-step3
          *ngIf="currentStep === 3"
          [parentForm]="simulationForm"
          [customers]="customers"
          [vehicles]="vehicles"
          [loading]="loading"
          (prev)="prevStep()"
          (calculate)="runSimulation()"
        ></app-simulation-step3>

        <!-- Results: Cronograma -->
        <app-simulation-schedule
          *ngIf="currentStep === 4"
          [result]="simulationResult"
          [customerName]="getSelectedCustomerName()"
          (viewIndicators)="goToIndicators()"
          (newSimulation)="resetWizard()"
        ></app-simulation-schedule>

        <!-- Results: Indicadores -->
        <app-simulation-indicators
          *ngIf="currentStep === 5"
          [result]="simulationResult"
          [customerName]="getSelectedCustomerName()"
          [parentForm]="simulationForm"
          (back)="backToSchedule()"
        ></app-simulation-indicators>
      </div>

    </div>
  `
})
export class SimulationWizardComponent implements OnInit {
  simulationForm!: FormGroup;
  currentStep = 1;
  loading = false;

  // Catalogs
  customers: Customer[] = [];
  vehicles: Vehicle[] = [];
  financialEntities: FinancialEntity[] = [];
  defaultEntityId = 1;

  // Calculation Results
  simulationResult: any = null;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private vehicleService: VehicleService,
    private financialEntityService: FinancialEntityService,
    private simulationService: SimulationService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.fetchCatalogs();
  }

  initForm() {
    this.simulationForm = this.fb.group({
      customerId: [null, Validators.required],
      vehicleId: [null, Validators.required],
      vehiclePrice: [0],
      initialPaymentPercentage: [20, [Validators.required, Validators.min(10), Validators.max(90)]],
      finalPaymentPercentage: [40, [Validators.required, Validators.min(0), Validators.max(100)]],
      termMonths: [36, Validators.required],
      interestRate: [14, [Validators.required, Validators.min(1)]],
      interestRateType: ['TEA', Validators.required],
      capitalizationType: [null],
      currency: ['PEN', Validators.required],
      graceType: ['S', Validators.required], // 'S' = Sin gracia, 'P' = Parcial, 'T' = Total
      desgravamenRate: [0.050, Validators.required],
      riskInsuranceRate: [80.00, Validators.required],
      portesFee: [10.00, Validators.required]
    });
  }

  fetchCatalogs() {
    // Customers
    this.customerService.getAll().subscribe({
      next: (data) => {
        this.customers = data;
        if (this.customers.length === 0) {
          this.seedMockCustomers();
        }
      },
      error: () => this.seedMockCustomers()
    });

    // Vehicles
    this.vehicleService.getAll().subscribe({
      next: (data) => {
        this.vehicles = data;
        if (this.vehicles.length === 0) {
          this.seedMockVehicles();
        }
      },
      error: () => this.seedMockVehicles()
    });

    // Financial Entities
    this.financialEntityService.getAll().subscribe({
      next: (entities) => {
        this.financialEntities = entities;
        if (this.financialEntities.length > 0) {
          this.defaultEntityId = this.financialEntities[0].id || 1;
        } else {
          // Seed standard bank
          this.financialEntityService.create({ name: 'Interbank', standardTea: 14.0 }).subscribe({
            next: (saved) => {
              this.defaultEntityId = saved.id || 1;
            }
          });
        }
      },
      error: () => {
        this.defaultEntityId = 1;
      }
    });
  }

  seedMockCustomers() {
    this.customers = [
      { id: 1, firstName: 'Mateo', lastName: 'Rojas', email: 'mrojas@example.com', phoneNumber: '987 654 321', documentType: 'DNI', documentNumber: '78451236' },
      { id: 2, firstName: 'Lucía', lastName: 'Carmenates', email: 'lcarmenates@example.com', phoneNumber: '945 123 887', documentType: 'DNI', documentNumber: '72981034' },
      { id: 3, firstName: 'Javier', lastName: 'Ponce', email: 'jponce@example.com', phoneNumber: '912 345 678', documentType: 'DNI', documentNumber: '10928374' }
    ];
  }

  seedMockVehicles() {
    this.vehicles = [
      { id: 1, brand: 'Toyota', model: 'Yaris', price: 60000, imageUrl: 'SEDÁN', year: 2024 },
      { id: 2, brand: 'Kia', model: 'Sportage', price: 25000, imageUrl: 'SUV', year: 2024 },
      { id: 3, brand: 'Hyundai', model: 'H1', price: 100000, imageUrl: 'COMERCIAL', year: 2023 }
    ];
  }

  getConnectorWidth(): number {
    if (this.currentStep === 1) return 0;
    if (this.currentStep === 2) return 50;
    return 100;
  }

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  getSelectedCustomerName(): string {
    const id = Number(this.simulationForm.get('customerId')?.value);
    const customer = this.customers.find(c => c.id === id);
    return customer ? `${customer.firstName} ${customer.lastName}` : '';
  }

  goToIndicators() {
    this.currentStep = 5;
  }

  backToSchedule() {
    this.currentStep = 4;
  }

  resetWizard() {
    this.initForm();
    this.simulationResult = null;
    this.currentStep = 1;
  }

  runSimulation() {
    this.loading = true;
    const formVal = this.simulationForm.value;

    // Build grace period array
    const n = formVal.termMonths;
    const graceType = formVal.graceType;
    const graceArray: string[] = [];
    
    for (let i = 0; i < n; i++) {
      if (graceType === 'P') {
        // First 3 months partial grace, then base S
        graceArray.push(i < 3 ? 'P' : 'S');
      } else if (graceType === 'T') {
        // First 3 months total grace, then base S
        graceArray.push(i < 3 ? 'T' : 'S');
      } else {
        graceArray.push('S');
      }
    }

    // Convert flat fee monthly risk insurance to annual percentage rate
    // segRiePer = rate * pv * 30 / 360 => rate = (segRiePer * 12) / pv
    const monthlyRiskFee = formVal.riskInsuranceRate;
    const pv = formVal.vehiclePrice;
    const annualRiskInsuranceRate = pv > 0 ? (monthlyRiskFee * 12) / pv : 0;

    // Convert form percentages from e.g. 14% to 0.14 fraction value
    const request: SimulationRequestPayload = {
      name: `Simulación ${this.getSelectedCustomerName()}`,
      vehiclePrice: formVal.vehiclePrice,
      initialPaymentPercentage: formVal.initialPaymentPercentage / 100,
      finalPaymentPercentage: formVal.finalPaymentPercentage / 100,
      termMonths: formVal.termMonths,
      interestRate: formVal.interestRate / 100,
      interestRateType: formVal.interestRateType,
      capitalizationType: formVal.capitalizationType || 'Diaria',
      paymentFrequency: 30,
      daysPerYear: 360,
      
      // Capitalized fees are 0
      notaryCost: 0.0,
      registrationCost: 0.0,
      appraisalCost: 0.0,
      studyCommission: 0.0,
      activationCommission: 0.0,
      
      // Periodic fees
      gpsFee: 0.0,
      portesFee: formVal.portesFee,
      adminFee: 0.0,
      desgravamenRate: formVal.desgravamenRate / 100,
      riskInsuranceRate: annualRiskInsuranceRate,
      cokRate: 0.125, // WACC Interno 12.5%
      
      // Foreign keys
      customerId: Number(formVal.customerId),
      vehicleId: Number(formVal.vehicleId),
      financialEntityId: this.defaultEntityId,
      gracePeriods: graceArray
    };

    this.simulationService.create(request).subscribe({
      next: (res) => {
        this.simulationResult = res;
        this.currentStep = 4; // Go to results view
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Hubo un error al calcular la simulación en el servidor local. Por favor verifica la conexión con Spring Boot.');
      }
    });
  }
}
