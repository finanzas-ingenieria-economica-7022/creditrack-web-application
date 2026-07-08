import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="iam-screen py-8">
      <div class="iam-card iam-card-wide px-8 py-8 sm:px-10">
        <div class="text-center">
          <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-primary shadow-lg shadow-blue-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold tracking-tight text-white">CrediTrack</h1>
          <p class="text-xs text-gray-500">Internal Banking</p>
          <p class="mt-3 text-sm text-gray-400">Registro de nuevo asesor autorizado</p>
        </div>

        <div class="my-6 h-px bg-dark-border"></div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label class="iam-label" for="firstName">Nombres</label>
              <input id="firstName" type="text" formControlName="firstName" placeholder="Juan Carlos" class="iam-input" [ngClass]="{ 'border-red-500 focus:border-red-500': submitted && f['firstName'].invalid }" />
              <p *ngIf="submitted && f['firstName'].errors" class="mt-1 text-xs text-red-400">El nombre es obligatorio.</p>
            </div>

            <div>
              <label class="iam-label" for="lastName">Apellidos</label>
              <input id="lastName" type="text" formControlName="lastName" placeholder="Pérez Gómez" class="iam-input" [ngClass]="{ 'border-red-500 focus:border-red-500': submitted && f['lastName'].invalid }" />
              <p *ngIf="submitted && f['lastName'].errors" class="mt-1 text-xs text-red-400">El apellido es obligatorio.</p>
            </div>

            <div>
              <label class="iam-label" for="documentType">Tipo de documento</label>
              <select id="documentType" formControlName="documentType" class="iam-input cursor-pointer">
                <option value="DNI">DNI (Documento Nacional de Identidad)</option>
                <option value="RUC">RUC (Registro Único de Contribuyentes)</option>
                <option value="CE">CE (Carné de Extranjería)</option>
              </select>
            </div>

            <div>
              <label class="iam-label" for="documentNumber">Número de documento</label>
              <input id="documentNumber" type="text" formControlName="documentNumber" placeholder="70123456" class="iam-input" [ngClass]="{ 'border-red-500 focus:border-red-500': submitted && f['documentNumber'].invalid }" />
              <p *ngIf="submitted && f['documentNumber'].errors" class="mt-1 text-xs text-red-400">El número de documento es obligatorio.</p>
            </div>

            <div>
              <label class="iam-label" for="phoneNumber">Número de teléfono</label>
              <input id="phoneNumber" type="text" formControlName="phoneNumber" placeholder="987654321" class="iam-input" [ngClass]="{ 'border-red-500 focus:border-red-500': submitted && f['phoneNumber'].invalid }" />
              <p *ngIf="submitted && f['phoneNumber'].errors" class="mt-1 text-xs text-red-400">El teléfono es obligatorio.</p>
            </div>

            <div>
              <label class="iam-label" for="email">Correo electrónico</label>
              <input id="email" type="email" formControlName="email" placeholder="asesor@banco.com.pe" class="iam-input" [ngClass]="{ 'border-red-500 focus:border-red-500': submitted && f['email'].invalid }" />
              <p *ngIf="submitted && f['email'].errors" class="mt-1 text-xs text-red-400">
                <span *ngIf="f['email'].errors?.['required']">El correo es obligatorio.</span>
                <span *ngIf="f['email'].errors?.['email']">Ingresa un correo válido.</span>
              </p>
            </div>

            <div>
              <label class="iam-label" for="password">Contraseña</label>
              <input id="password" type="password" formControlName="password" placeholder="••••••••" class="iam-input" [ngClass]="{ 'border-red-500 focus:border-red-500': submitted && f['password'].invalid }" />
              <p *ngIf="submitted && f['password'].errors" class="mt-1 text-xs text-red-400">
                <span *ngIf="f['password'].errors?.['required']">La contraseña es obligatoria.</span>
                <span *ngIf="f['password'].errors?.['minlength']">La contraseña debe tener mínimo 6 caracteres.</span>
              </p>
            </div>

            <div>
              <label class="iam-label" for="confirmPassword">Confirmar contraseña</label>
              <input id="confirmPassword" type="password" formControlName="confirmPassword" placeholder="••••••••" class="iam-input" [ngClass]="{ 'border-red-500 focus:border-red-500': submitted && registerForm.errors?.['mismatch'] }" />
              <p *ngIf="submitted && registerForm.errors?.['mismatch']" class="mt-1 text-xs text-red-400">Las contraseñas no coinciden.</p>
            </div>
          </div>

          <div *ngIf="registerError" class="rounded-xl border border-red-900 bg-status-rejected-bg/80 p-4 text-sm text-gray-100">
            <p class="font-semibold text-white">No se pudo registrar el usuario.</p>
            <p class="mt-1 text-xs text-gray-300">{{ errorMessage }}</p>
          </div>

          <button type="submit" [disabled]="loading" class="iam-button-primary flex items-center justify-center gap-2">
            <svg *ngIf="loading" class="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Crear cuenta</span>
          </button>
        </form>

        <p class="mt-6 text-center text-xs text-gray-400">
          ¿Ya tienes una cuenta?
          <a routerLink="/login" class="font-semibold text-brand-text hover:underline">Inicia sesión aquí</a>
        </p>
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      documentType: ['DNI', Validators.required],
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

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    this.submitted = true;
    this.registerError = false;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    const values = this.registerForm.getRawValue() as {
      firstName: string;
      lastName: string;
      documentType: string;
      documentNumber: string;
      phoneNumber: string;
      email: string;
      password: string;
      confirmPassword: string;
    };

    this.authService.register({
      username: values.email,
      email: values.email,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
      documentType: values.documentType,
      documentNumber: values.documentNumber,
      phoneNumber: values.phoneNumber
    }).subscribe({
      next: () => {
        this.loading = false;
        void this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loading = false;
        this.registerError = true;
        this.errorMessage = error?.error?.message ?? 'Hubo un error de conexión con el servidor.';
      }
    });
  }
}
