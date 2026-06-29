import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-dark-bg px-4 py-8">
      <div class="w-full max-w-2xl bg-dark-card border border-dark-border rounded-xl p-8 shadow-2xl">
        <!-- Header -->
        <div class="text-center mb-6">
          <div class="flex justify-center items-center space-x-3 mb-2">
            <div class="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 class="text-white font-bold text-2xl tracking-wide leading-none">CrediTrack</h1>
              <span class="text-xs text-gray-500 block text-left">Internal Banking</span>
            </div>
          </div>
          <p class="text-sm text-gray-400">Registro de nuevo asesor autorizado</p>
        </div>

        <hr class="border-dark-border mb-6" />

        <!-- Form -->
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
          
          <!-- Grid container for fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Nombres -->
            <div>
              <label class="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">Nombres</label>
              <input
                type="text"
                formControlName="firstName"
                placeholder="Juan Carlos"
                class="w-full px-4 py-3 bg-dark-input border border-dark-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary transition duration-150"
                [ngClass]="{ 'border-red-500 focus:border-red-500': submitted && f['firstName'].errors }"
              />
              <div *ngIf="submitted && f['firstName'].errors" class="text-red-500 text-xs mt-1">
                <span>El nombre es obligatorio.</span>
              </div>
            </div>

            <!-- Apellidos -->
            <div>
              <label class="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">Apellidos</label>
              <input
                type="text"
                formControlName="lastName"
                placeholder="Pérez Gómez"
                class="w-full px-4 py-3 bg-dark-input border border-dark-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary transition duration-150"
                [ngClass]="{ 'border-red-500 focus:border-red-500': submitted && f['lastName'].errors }"
              />
              <div *ngIf="submitted && f['lastName'].errors" class="text-red-500 text-xs mt-1">
                <span>El apellido es obligatorio.</span>
              </div>
            </div>

            <!-- Tipo de Documento -->
            <div>
              <label class="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">Tipo de Documento</label>
              <select
                formControlName="documentType"
                class="w-full px-4 py-3 bg-dark-input border border-dark-border rounded-lg text-white focus:outline-none focus:border-brand-primary transition duration-150 cursor-pointer"
              >
                <option value="DNI">DNI (Documento Nacional de Identidad)</option>
                <option value="RUC">RUC (Registro Único de Contribuyentes)</option>
                <option value="CE">CE (Carné de Extranjería)</option>
              </select>
            </div>

            <!-- Número de Documento -->
            <div>
              <label class="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">Número de Documento</label>
              <input
                type="text"
                formControlName="documentNumber"
                placeholder="70123456"
                class="w-full px-4 py-3 bg-dark-input border border-dark-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary transition duration-150"
                [ngClass]="{ 'border-red-500 focus:border-red-500': submitted && f['documentNumber'].errors }"
              />
              <div *ngIf="submitted && f['documentNumber'].errors" class="text-red-500 text-xs mt-1">
                <span>El número de documento es obligatorio.</span>
              </div>
            </div>

            <!-- Teléfono -->
            <div>
              <label class="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">Número de Teléfono</label>
              <input
                type="text"
                formControlName="phoneNumber"
                placeholder="987654321"
                class="w-full px-4 py-3 bg-dark-input border border-dark-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary transition duration-150"
                [ngClass]="{ 'border-red-500 focus:border-red-500': submitted && f['phoneNumber'].errors }"
              />
              <div *ngIf="submitted && f['phoneNumber'].errors" class="text-red-500 text-xs mt-1">
                <span>El teléfono es obligatorio.</span>
              </div>
            </div>

            <!-- Correo Electrónico -->
            <div>
              <label class="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">Correo Electrónico</label>
              <input
                type="email"
                formControlName="email"
                placeholder="asesor@banco.com.pe"
                class="w-full px-4 py-3 bg-dark-input border border-dark-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary transition duration-150"
                [ngClass]="{ 'border-red-500 focus:border-red-500': submitted && f['email'].errors }"
              />
              <div *ngIf="submitted && f['email'].errors" class="text-red-500 text-xs mt-1">
                <span *ngIf="f['email'].errors['required']">El correo es obligatorio.</span>
                <span *ngIf="f['email'].errors['email']">Ingrese un correo válido.</span>
              </div>
            </div>

            <!-- Contraseña -->
            <div>
              <label class="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">Contraseña</label>
              <input
                type="password"
                formControlName="password"
                placeholder="••••••••"
                class="w-full px-4 py-3 bg-dark-input border border-dark-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary transition duration-150"
                [ngClass]="{ 'border-red-500 focus:border-red-500': submitted && f['password'].errors }"
              />
              <div *ngIf="submitted && f['password'].errors" class="text-red-500 text-xs mt-1">
                <span *ngIf="f['password'].errors['required']">La contraseña es obligatoria.</span>
                <span *ngIf="f['password'].errors['minlength']">La contraseña debe tener mínimo 6 caracteres.</span>
              </div>
            </div>

            <!-- Confirmar Contraseña -->
            <div>
              <label class="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">Confirmar Contraseña</label>
              <input
                type="password"
                formControlName="confirmPassword"
                placeholder="••••••••"
                class="w-full px-4 py-3 bg-dark-input border border-dark-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary transition duration-150"
                [ngClass]="{ 'border-red-500 focus:border-red-500': submitted && registerForm.errors?.['mismatch'] }"
              />
              <div *ngIf="submitted && registerForm.errors?.['mismatch']" class="text-red-500 text-xs mt-1">
                <span>Las contraseñas no coinciden.</span>
              </div>
            </div>
          </div>

          <!-- Alert Cards -->
          <div *ngIf="registerError" class="bg-status-rejected-bg border border-red-900 rounded-lg p-4 text-white flex items-start space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-status-rejected-text flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <div class="text-xs">
              <p class="font-bold text-white mb-0.5">Error en el registro.</p>
              <p class="text-gray-300">{{ errorMessage }}</p>
            </div>
          </div>

          <div *ngIf="successMessage" class="bg-status-completed-bg border border-emerald-900 rounded-lg p-4 text-white flex items-start space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-status-completed-text flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <div class="text-xs">
              <p class="font-bold text-white mb-0.5">¡Registro completado!</p>
              <p class="text-gray-200">Redirigiendo a la pantalla de inicio de sesión...</p>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="loading"
            class="w-full py-3 bg-brand-primary hover:bg-brand-hover text-white font-bold rounded-lg transition duration-150 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <svg *ngIf="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Crear cuenta</span>
          </button>
        </form>

        <!-- Back to login link -->
        <div class="mt-6 text-center">
          <p class="text-xs text-gray-400">
            ¿Ya tienes una cuenta? <a routerLink="/login" class="text-brand-text hover:underline font-semibold ml-1">Inicia sesión aquí</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  loading = false;
  registerError = false;
  errorMessage = '';
  successMessage = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      documentType: ['DNI'],
      documentNumber: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  get f() {
    return this.registerForm.controls;
  }

  passwordMatchValidator(g: AbstractControl) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    this.submitted = true;
    this.registerError = false;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    const val = this.registerForm.value;

    const requestPayload = {
      username: val.email, // Set username to email for consistency
      email: val.email,
      password: val.password,
      firstName: val.firstName,
      lastName: val.lastName,
      documentType: val.documentType,
      documentNumber: val.documentNumber,
      phoneNumber: val.phoneNumber
    };

    this.authService.register(requestPayload).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = true;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.registerError = true;
        this.errorMessage = err.error || 'Hubo un error de conexión con el servidor.';
      }
    });
  }
}
