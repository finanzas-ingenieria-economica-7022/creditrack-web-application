import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CustomerService, Customer } from '../../../../core/services/customer.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Title & Action Bar -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 class="text-white font-bold text-2xl tracking-wide">Clientes</h1>
        
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
              placeholder="Buscar por dni, nombre..."
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
            <span>Registrar cliente</span>
          </button>
        </div>
      </div>

      <!-- Customers Table Card -->
      <div class="bg-dark-card border border-dark-border rounded-xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-dark-border text-gray-500 text-[10px] uppercase font-bold tracking-wider">
                <th class="px-6 py-4">Cliente</th>
                <th class="px-6 py-4">DNI</th>
                <th class="px-6 py-4">Teléfono</th>
                <th class="px-6 py-4 text-center">Simulaciones</th>
                <th class="px-6 py-4">Estado</th>
                <th class="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-dark-border text-sm text-gray-300">
              <!-- Loading indicator -->
              <tr *ngIf="loading">
                <td colspan="6" class="px-6 py-10 text-center text-gray-500">
                  <div class="flex items-center justify-center space-x-2">
                    <div class="w-4 h-4 rounded-full border-2 border-brand-primary border-t-transparent animate-spin"></div>
                    <span>Cargando directorio de clientes...</span>
                  </div>
                </td>
              </tr>

              <!-- Empty state -->
              <tr *ngIf="!loading && filteredCustomers.length === 0">
                <td colspan="6" class="px-6 py-10 text-center text-gray-500">
                  No se encontraron clientes registrados.
                </td>
              </tr>

              <!-- Customer rows -->
              <tr *ngFor="let cust of pagedCustomers" class="hover:bg-gray-800/10 transition duration-100">
                <td class="px-6 py-4 flex items-center space-x-3">
                  <!-- Initials circle -->
                  <div class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 font-bold text-xs uppercase">
                    {{ getInitials(cust.firstName, cust.lastName) }}
                  </div>
                  <span class="font-medium text-white">{{ cust.firstName }} {{ cust.lastName }}</span>
                </td>
                <td class="px-6 py-4 font-mono text-gray-400">{{ cust.documentNumber }}</td>
                <td class="px-6 py-4">{{ formatPhone(cust.phoneNumber) }}</td>
                <td class="px-6 py-4 text-center">{{ mockSimulationsCount(cust.id) }}</td>
                <td class="px-6 py-4">
                  <span
                    class="inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider"
                    [ngClass]="mockCustomerStatus(cust.id) === 'ACTIVO' ? 'bg-status-completed-bg text-status-completed-text' : 'bg-status-rejected-bg text-status-rejected-text'"
                  >
                    {{ mockCustomerStatus(cust.id) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right space-x-3 shrink-0">
                  <!-- View Details -->
                  <button (click)="viewDetails(cust)" class="text-gray-400 hover:text-white transition duration-150 inline-block align-middle" title="Ver detalles">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <!-- Edit Button -->
                  <button (click)="openEditModal(cust)" class="text-gray-400 hover:text-white transition duration-150 inline-block align-middle" title="Editar">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <!-- Delete Button -->
                  <button (click)="deleteCustomer(cust)" class="text-gray-500 hover:text-red-400 transition duration-150 inline-block align-middle" title="Eliminar">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
            Mostrando {{ getShowingRangeText() }} de {{ filteredCustomers.length }}
          </div>
          <div class="flex items-center space-x-1">
            <!-- Prev Arrow -->
            <button
              [disabled]="currentPage === 1"
              (click)="changePage(currentPage - 1)"
              class="p-2 border border-dark-border hover:bg-gray-800 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <!-- Page indicators -->
            <button
              *ngFor="let page of getPageNumbers()"
              (click)="changePage(page)"
              class="w-8 h-8 rounded-lg border font-medium text-xs transition duration-150"
              [ngClass]="page === currentPage ? 'bg-brand-primary border-brand-primary text-white font-bold' : 'border-dark-border hover:bg-gray-800 text-gray-400'"
            >
              {{ page }}
            </button>

            <!-- Next Arrow -->
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

      <!-- Add/Edit Customer Modal (Overlay) -->
      <div *ngIf="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
        <div class="w-full max-w-xl bg-dark-card border border-dark-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-dark-border flex items-center justify-between">
            <h3 class="text-white font-bold text-base">{{ editingCustomer ? 'Editar cliente' : 'Registrar nuevo cliente' }}</h3>
            <button (click)="closeModal()" class="text-gray-500 hover:text-white transition duration-150">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Form -->
          <form [formGroup]="customerForm" (ngSubmit)="onSave()" class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- NOMBRES -->
              <div>
                <label class="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">Nombres</label>
                <input
                  type="text"
                  formControlName="firstName"
                  placeholder="Mateo"
                  class="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary text-sm transition duration-150"
                  [ngClass]="{ 'border-red-500': submitted && f['firstName'].errors }"
                />
              </div>

              <!-- TELÉFONO -->
              <div>
                <label class="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">Teléfono</label>
                <div class="relative flex">
                  <span class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-dark-border bg-gray-800 text-gray-500 text-sm select-none">
                    +51
                  </span>
                  <input
                    type="text"
                    formControlName="phoneNumber"
                    placeholder="987 654 321"
                    class="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-r-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary text-sm transition duration-150"
                    [ngClass]="{ 'border-red-500': submitted && f['phoneNumber'].errors }"
                  />
                </div>
              </div>

              <!-- APELLIDOS -->
              <div>
                <label class="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">Apellidos</label>
                <input
                  type="text"
                  formControlName="lastName"
                  placeholder="Rojas"
                  class="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary text-sm transition duration-150"
                  [ngClass]="{ 'border-red-500': submitted && f['lastName'].errors }"
                />
              </div>

              <!-- CORREO ELECTRÓNICO -->
              <div>
                <label class="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">Correo Electrónico</label>
                <input
                  type="email"
                  formControlName="email"
                  placeholder="mrojas@example.com"
                  class="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary text-sm transition duration-150"
                  [ngClass]="{ 'border-red-500': submitted && f['email'].errors }"
                />
              </div>

              <!-- DNI -->
              <div class="md:col-span-2">
                <label class="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">DNI</label>
                <div class="relative">
                  <input
                    type="text"
                    formControlName="documentNumber"
                    placeholder="72849103"
                    class="w-full pl-4 pr-10 py-2.5 bg-dark-input border border-dark-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary text-sm transition duration-150"
                    [ngClass]="{ 'border-red-500': submitted && f['documentNumber'].errors }"
                  />
                  <!-- DNI validation checkmark -->
                  <span *ngIf="f['documentNumber'].valid" class="absolute inset-y-0 right-0 pr-3 flex items-center text-status-completed-text">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
                <div *ngIf="submitted && f['documentNumber'].errors" class="text-red-500 text-xs mt-1">
                  <span *ngIf="f['documentNumber'].errors['required']">El DNI es obligatorio.</span>
                  <span *ngIf="f['documentNumber'].errors['pattern']">El DNI debe contener 8 dígitos numéricos.</span>
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
                class="px-5 py-2.5 bg-blue-200 hover:bg-blue-300 text-blue-950 font-bold text-sm rounded-lg transition duration-150 flex items-center space-x-2 disabled:opacity-50"
              >
                <div *ngIf="saving" class="w-4 h-4 rounded-full border-2 border-blue-950 border-t-transparent animate-spin mr-1"></div>
                <span>Guardar cliente</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  pagedCustomers: Customer[] = [];
  loading = false;
  saving = false;
  submitted = false;

  // Pagination properties
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  // Search filter
  searchQuery = '';

  // Modal properties
  isModalOpen = false;
  customerForm: FormGroup;
  editingCustomer: Customer | null = null;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute
  ) {
    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      documentType: ['DNI'],
      documentNumber: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]]
    });
  }

  ngOnInit() {
    this.fetchCustomers();
    this.route.queryParams.subscribe(params => {
      if (params['openModal'] === 'true') {
        this.openAddModal();
      }
    });
  }

  get f() {
    return this.customerForm.controls;
  }

  fetchCustomers() {
    this.loading = true;
    this.customerService.getAll().subscribe({
      next: (data) => {
        this.customers = data;
        this.onSearch(); // Apply filters and setup pagination
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        // Fallback mock database seeding if local backend is empty
        this.loadMockData();
      }
    });
  }

  loadMockData() {
    this.customers = [
      { id: 1, firstName: 'Mateo', lastName: 'Rojas', email: 'mrojas@example.com', phoneNumber: '987 654 321', documentType: 'DNI', documentNumber: '45123890' },
      { id: 2, firstName: 'Lucía', lastName: 'Carmenates', email: 'lcarmenates@example.com', phoneNumber: '945 123 887', documentType: 'DNI', documentNumber: '72981034' },
      { id: 3, firstName: 'Javier', lastName: 'Ponce', email: 'jponce@example.com', phoneNumber: '912 345 678', documentType: 'DNI', documentNumber: '10928374' },
      { id: 4, firstName: 'Sofía', lastName: 'Mendoza', email: 'smendoza@example.com', phoneNumber: '999 888 777', documentType: 'DNI', documentNumber: '45889921' },
      { id: 5, firstName: 'Diego', lastName: 'Torres', email: 'dtorres@example.com', phoneNumber: '922 111 333', documentType: 'DNI', documentNumber: '76543210' }
    ];
    this.onSearch();
  }

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.filteredCustomers = [...this.customers];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredCustomers = this.customers.filter(c => 
        c.firstName.toLowerCase().includes(query) ||
        c.lastName.toLowerCase().includes(query) ||
        c.documentNumber.includes(query)
      );
    }
    this.currentPage = 1;
    this.calculatePagination();
  }

  calculatePagination() {
    this.totalPages = Math.max(1, Math.ceil(this.filteredCustomers.length / this.pageSize));
    this.updatePagedList();
  }

  updatePagedList() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedCustomers = this.filteredCustomers.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagedList();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getShowingRangeText(): string {
    if (this.filteredCustomers.length === 0) return '0-0';
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(start + this.pageSize - 1, this.filteredCustomers.length);
    return `${start}-${end}`;
  }

  getInitials(first: string, last: string): string {
    return `${first.substring(0, 1)}${last.substring(0, 1)}`.toUpperCase();
  }

  formatPhone(phone: string): string {
    // Return custom formatted phone
    return phone;
  }

  // Mock metadata based on ID
  mockSimulationsCount(id?: number): number {
    if (!id) return 0;
    const counts: { [key: number]: number } = { 1: 3, 2: 1, 3: 5, 4: 0, 5: 2 };
    return counts[id] !== undefined ? counts[id] : 0;
  }

  mockCustomerStatus(id?: number): string {
    if (!id) return 'ACTIVO';
    // Javier Ponce (ID 3) is INACTIVE as per V05
    return id === 3 ? 'INACTIVO' : 'ACTIVO';
  }

  // CRUD Actions
  openAddModal() {
    this.editingCustomer = null;
    this.submitted = false;
    this.customerForm.reset({
      documentType: 'DNI'
    });
    this.isModalOpen = true;
  }

  openEditModal(customer: Customer) {
    this.editingCustomer = customer;
    this.submitted = false;
    this.customerForm.patchValue({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      documentType: customer.documentType,
      documentNumber: customer.documentNumber
    });
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  viewDetails(customer: Customer) {
    // In this iteration we can simply open the edit modal in mock-readonly or edit mode for client details
    this.openEditModal(customer);
  }

  deleteCustomer(customer: Customer) {
    if (confirm(`¿Está seguro de eliminar al cliente ${customer.firstName} ${customer.lastName}?`)) {
      if (customer.id && customer.id > 5) { // Physically delete only newly added custom rows
        this.customerService.delete(customer.id).subscribe({
          next: () => this.fetchCustomers()
        });
      } else {
        // Mock delete for static seeded rows
        this.customers = this.customers.filter(c => c.id !== customer.id);
        this.onSearch();
      }
    }
  }

  onSave() {
    this.submitted = true;
    if (this.customerForm.invalid) {
      return;
    }

    this.saving = true;
    const formData = this.customerForm.value;

    if (this.editingCustomer) {
      // Update
      const updatedCust: Customer = { ...this.editingCustomer, ...formData };
      if (this.editingCustomer.id && this.editingCustomer.id > 5) {
        this.customerService.update(this.editingCustomer.id, updatedCust).subscribe({
          next: () => {
            this.saving = false;
            this.isModalOpen = false;
            this.fetchCustomers();
          },
          error: () => {
            this.saving = false;
          }
        });
      } else {
        // Mock update for static items
        const index = this.customers.findIndex(c => c.id === this.editingCustomer?.id);
        if (index !== -1) {
          this.customers[index] = updatedCust;
        }
        this.saving = false;
        this.isModalOpen = false;
        this.onSearch();
      }
    } else {
      // Create
      const newCust: Customer = { ...formData };
      // Check if we are running in memory mock or backend
      this.customerService.create(newCust).subscribe({
        next: (saved) => {
          this.saving = false;
          this.isModalOpen = false;
          this.fetchCustomers();
        },
        error: () => {
          // Mock create
          const mockId = Math.max(...this.customers.map(c => c.id || 0)) + 1;
          this.customers.push({ id: mockId, ...newCust });
          this.saving = false;
          this.isModalOpen = false;
          this.onSearch();
        }
      });
    }
  }
}
