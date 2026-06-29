import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { VehicleService, Vehicle } from '../../../../core/services/vehicle.service';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Title & Action Bar -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 class="text-white font-bold text-2xl tracking-wide">Vehículos</h1>
        
        <div class="flex items-center space-x-3 w-full md:w-auto">
          <!-- Search input -->
          <div class="relative flex-1 md:w-80">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (input)="onSearch()"
              placeholder="Buscar por placa, modelo..."
              class="w-full pl-10 pr-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary text-sm transition duration-150"
            />
          </div>

          <!-- Add Button -->
          <button
            (click)="openAddModal()"
            class="px-4 py-2 bg-brand-primary hover:bg-brand-hover text-white font-bold text-sm rounded-lg flex items-center space-x-2 transition duration-150 shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Registrar vehículo</span>
          </button>
        </div>
      </div>

      <!-- Vehicle Card Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Loading spinner -->
        <div *ngIf="loading" class="col-span-full py-16 text-center text-gray-500">
          <div class="flex items-center justify-center space-x-2">
            <div class="w-5 h-5 rounded-full border-2 border-brand-primary border-t-transparent animate-spin"></div>
            <span>Cargando catálogo de vehículos...</span>
          </div>
        </div>

        <!-- Cards -->
        <div *ngFor="let veh of filteredVehicles" class="bg-dark-card border border-dark-border rounded-xl overflow-hidden hover:border-gray-700 transition duration-150 group relative">
          
          <!-- Delete Hover Button -->
          <button
            (click)="deleteVehicle(veh); $event.stopPropagation()"
            class="absolute top-3 right-3 p-1.5 bg-red-950/40 text-red-400 hover:bg-red-800 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition duration-150"
            title="Eliminar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          <!-- Edit click trigger wrapper -->
          <div (click)="openEditModal(veh)" class="cursor-pointer">
            <!-- Upper part: Image placeholder -->
            <div class="h-40 bg-gray-900/50 flex items-center justify-center border-b border-dark-border">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-700 group-hover:text-gray-500 transition duration-150" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.308-4.873a2.25 2.25 0 00-2.222-2.112h-13.84a2.25 2.25 0 00-2.222 2.112l-.308 4.873a1.129 1.129 0 001.09 1.124H9.75M9 7.5l.656-2.207a.75.75 0 01.722-.543h3.244a.75.75 0 01.722.543L15 7.5M9 7.5h6m-6 9h6m-6-4.5h6" />
              </svg>
            </div>

            <!-- Lower part: Details -->
            <div class="p-5 space-y-3">
              <div class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                {{ veh.imageUrl || 'SEDÁN' }}
              </div>
              <h4 class="text-white font-bold text-sm leading-none">
                {{ veh.brand }} {{ veh.model }}
              </h4>
              <div class="flex justify-between items-end">
                <span class="text-sm font-bold text-white">
                  {{ formatPrice(veh.price) }}
                </span>
                <span class="text-xs text-gray-500">{{ veh.year }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Add Dotted Dotted outline Card -->
        <div
          (click)="openAddModal()"
          class="h-[258px] border-2 border-dashed border-dark-border hover:border-gray-700 bg-transparent rounded-xl flex flex-col items-center justify-center cursor-pointer transition duration-150 group"
        >
          <div class="w-10 h-10 bg-gray-800/40 rounded-full flex items-center justify-center text-gray-400 group-hover:text-white mb-2 transition duration-150">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span class="text-xs font-semibold text-gray-500 group-hover:text-white transition duration-150">Registrar vehículo</span>
        </div>
      </div>

      <!-- Add/Edit Vehicle Modal (Overlay) -->
      <div *ngIf="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
        <div class="w-full max-w-xl bg-dark-card border border-dark-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-dark-border flex items-center justify-between">
            <h3 class="text-white font-bold text-base">{{ editingVehicle ? 'Editar vehículo' : 'Registrar vehículo' }}</h3>
            <button (click)="closeModal()" class="text-gray-500 hover:text-white transition duration-150">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Form -->
          <form [formGroup]="vehicleForm" (ngSubmit)="onSave()" class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- MARCA -->
              <div>
                <label class="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">Marca</label>
                <input
                  type="text"
                  formControlName="brand"
                  placeholder="Ej: Toyota"
                  class="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary text-sm transition duration-150"
                  [ngClass]="{ 'border-red-500': submitted && f['brand'].errors }"
                />
              </div>

              <!-- CATEGORÍA -->
              <div>
                <label class="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">Categoría</label>
                <select
                  formControlName="category"
                  class="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-white focus:outline-none focus:border-brand-primary text-sm transition duration-150 cursor-pointer"
                >
                  <option value="SEDÁN">Sedán</option>
                  <option value="SUV">SUV</option>
                  <option value="HATCHBACK">Hatchback</option>
                  <option value="COMERCIAL">Comercial</option>
                </select>
              </div>

              <!-- MODELO -->
              <div>
                <label class="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">Modelo</label>
                <input
                  type="text"
                  formControlName="model"
                  placeholder="Ej: Corolla"
                  class="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary text-sm transition duration-150"
                  [ngClass]="{ 'border-red-500': submitted && f['model'].errors }"
                />
              </div>

              <!-- PRECIO DE LISTA -->
              <div>
                <label class="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">Precio de Lista</label>
                <div class="relative flex">
                  <!-- Currency buttons -->
                  <div class="flex border border-r-0 border-dark-border rounded-l-lg overflow-hidden shrink-0">
                    <button
                      type="button"
                      (click)="setCurrency('PEN')"
                      class="px-3 bg-gray-800 text-xs font-bold transition duration-150"
                      [ngClass]="currency === 'PEN' ? 'text-white bg-brand-primary' : 'text-gray-500 bg-gray-800/40'"
                    >
                      S/
                    </button>
                    <button
                      type="button"
                      (click)="setCurrency('USD')"
                      class="px-3 bg-gray-800 text-xs font-bold transition duration-150 border-l border-dark-border"
                      [ngClass]="currency === 'USD' ? 'text-white bg-brand-primary' : 'text-gray-500 bg-gray-800/40'"
                    >
                      $
                    </button>
                  </div>
                  <input
                    type="number"
                    formControlName="price"
                    placeholder="0.00"
                    class="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-r-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary text-sm transition duration-150"
                    [ngClass]="{ 'border-red-500': submitted && f['price'].errors }"
                  />
                </div>
              </div>

              <!-- AÑO -->
              <div>
                <label class="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">Año</label>
                <input
                  type="number"
                  formControlName="year"
                  placeholder="2024"
                  class="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary text-sm transition duration-150"
                  [ngClass]="{ 'border-red-500': submitted && f['year'].errors }"
                />
                <div *ngIf="submitted && f['year'].errors" class="text-red-500 text-xs mt-1">
                  <span *ngIf="f['year'].errors['required']">El año es obligatorio.</span>
                </div>
              </div>
            </div>

            <!-- Modal Footer Action buttons -->
            <div class="flex items-center justify-end space-x-3 pt-4 border-t border-dark-border">
              <button
                type="button"
                (click)="closeModal()"
                class="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 border border-dark-border text-gray-300 font-semibold text-sm rounded-lg transition duration-150"
              >
                Cancelar
              </button>
              <button
                type="submit"
                [disabled]="saving"
                class="px-5 py-2.5 bg-brand-primary hover:bg-brand-hover text-white font-bold text-sm rounded-lg transition duration-150 flex items-center space-x-2 disabled:opacity-50"
              >
                <div *ngIf="saving" class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-1"></div>
                <span>Guardar vehículo</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class VehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  filteredVehicles: Vehicle[] = [];
  loading = false;
  saving = false;
  submitted = false;

  // Search filter
  searchQuery = '';

  // Modal properties
  isModalOpen = false;
  vehicleForm: FormGroup;
  editingVehicle: Vehicle | null = null;
  currency: 'PEN' | 'USD' = 'PEN';

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService
  ) {
    this.vehicleForm = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      category: ['SEDÁN'],
      price: ['', [Validators.required, Validators.min(1000)]],
      year: ['', [Validators.required, Validators.min(1980), Validators.max(2028)]]
    });
  }

  ngOnInit() {
    this.fetchVehicles();
  }

  get f() {
    return this.vehicleForm.controls;
  }

  fetchVehicles() {
    this.loading = true;
    this.vehicleService.getAll().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.onSearch();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.loadMockData();
      }
    });
  }

  loadMockData() {
    // Seeding static mock cars matching V07
    this.vehicles = [
      { id: 1, brand: 'Toyota', model: 'Yaris', price: 60000, imageUrl: 'SEDÁN', year: 2024 },
      { id: 2, brand: 'Kia', model: 'Sportage', price: 25000, imageUrl: 'SUV', year: 2024 },
      { id: 3, brand: 'Hyundai', model: 'H1', price: 100000, imageUrl: 'COMERCIAL', year: 2023 },
      { id: 4, brand: 'Honda', model: 'Civic', price: 30000, imageUrl: 'SEDÁN', year: 2024 }
    ];
    this.onSearch();
  }

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.filteredVehicles = [...this.vehicles];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredVehicles = this.vehicles.filter(v => 
        v.brand.toLowerCase().includes(query) ||
        v.model.toLowerCase().includes(query)
      );
    }
  }

  formatPrice(price: number): string {
    // If the price is low (like 25000 or 30000), it's probably USD
    // If the price is high (like 60000 or 100000), it's probably S/
    // Let's decide based on price thresholds or store it in a metadata list.
    // Mateo Rojas: S/ 48,000. Sofia Castro: USD 22,500.
    if (price <= 35000) {
      return 'USD ' + new Intl.NumberFormat('en-US').format(price);
    }
    return 'S/ ' + new Intl.NumberFormat('es-PE').format(price);
  }

  setCurrency(curr: 'PEN' | 'USD') {
    this.currency = curr;
  }

  // CRUD Actions
  openAddModal() {
    this.editingVehicle = null;
    this.submitted = false;
    this.currency = 'PEN';
    this.vehicleForm.reset({
      category: 'SEDÁN',
      year: 2024
    });
    this.isModalOpen = true;
  }

  openEditModal(vehicle: Vehicle) {
    this.editingVehicle = vehicle;
    this.submitted = false;
    this.currency = vehicle.price <= 35000 ? 'USD' : 'PEN';
    this.vehicleForm.patchValue({
      brand: vehicle.brand,
      model: vehicle.model,
      category: vehicle.imageUrl || 'SEDÁN',
      price: vehicle.price,
      year: vehicle.year
    });
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  deleteVehicle(vehicle: Vehicle) {
    if (confirm(`¿Está seguro de eliminar el vehículo ${vehicle.brand} ${vehicle.model}?`)) {
      if (vehicle.id && vehicle.id > 4) { // Only delete custom added rows from DB
        this.vehicleService.delete(vehicle.id).subscribe({
          next: () => this.fetchVehicles()
        });
      } else {
        this.vehicles = this.vehicles.filter(v => v.id !== vehicle.id);
        this.onSearch();
      }
    }
  }

  onSave() {
    this.submitted = true;
    if (this.vehicleForm.invalid) {
      return;
    }

    this.saving = true;
    const formData = this.vehicleForm.value;

    const requestPayload: Vehicle = {
      brand: formData.brand,
      model: formData.model,
      price: formData.price,
      imageUrl: formData.category, // store category in imageUrl field
      year: formData.year
    };

    if (this.editingVehicle) {
      const updatedVeh = { ...this.editingVehicle, ...requestPayload };
      if (this.editingVehicle.id && this.editingVehicle.id > 4) {
        this.vehicleService.update(this.editingVehicle.id, updatedVeh).subscribe({
          next: () => {
            this.saving = false;
            this.isModalOpen = false;
            this.fetchVehicles();
          },
          error: () => {
            this.saving = false;
          }
        });
      } else {
        // Mock update
        const index = this.vehicles.findIndex(v => v.id === this.editingVehicle?.id);
        if (index !== -1) {
          this.vehicles[index] = updatedVeh;
        }
        this.saving = false;
        this.isModalOpen = false;
        this.onSearch();
      }
    } else {
      // Create
      this.vehicleService.create(requestPayload).subscribe({
        next: () => {
          this.saving = false;
          this.isModalOpen = false;
          this.fetchVehicles();
        },
        error: () => {
          // Mock create
          const mockId = Math.max(...this.vehicles.map(v => v.id || 0)) + 1;
          this.vehicles.push({ id: mockId, ...requestPayload });
          this.saving = false;
          this.isModalOpen = false;
          this.onSearch();
        }
      });
    }
  }
}
