import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-dark-bg px-4">
      <div class="w-full max-w-md bg-dark-card border border-dark-border rounded-xl p-8 shadow-2xl">
        <!-- Icon Header -->
        <div class="text-center mb-6">
          <div class="flex justify-center mb-4">
            <div class="w-12 h-12 bg-brand-primary/20 border border-brand-primary/30 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-brand-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h1 class="text-white font-bold text-xl mb-2">Recuperar acceso</h1>
          <p class="text-xs text-gray-400 max-w-xs mx-auto">
            Ingresa tu correo y te enviaremos un enlace válido por 15 minutos.
          </p>
        </div>

        <!-- Form -->
        <form [formGroup]="recoverForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <!-- Email Input -->
          <div>
            <label class="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">Correo Electrónico</label>
            <input
              type="email"
              formControlName="email"
              placeholder="tu@correo.com"
              class="w-full px-4 py-3 bg-dark-input border border-dark-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary transition duration-150"
              [ngClass]="{ 'border-red-500 focus:border-red-500': submitted && f['email'].errors }"
            />
            <div *ngIf="submitted && f['email'].errors" class="text-red-500 text-xs mt-1">
              <span *ngIf="f['email'].errors['required']">El correo es obligatorio.</span>
              <span *ngIf="f['email'].errors['email']">Ingrese un correo válido.</span>
            </div>
          </div>

          <!-- Success Alert -->
          <div *ngIf="successMessage" class="bg-status-completed-bg/20 border border-status-completed-bg rounded-lg p-4 text-status-completed-text text-xs">
            <p class="font-bold mb-1">¡Correo enviado!</p>
            <p>Por favor revisa tu bandeja de entrada para completar la restauración.</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="loading"
            class="w-full py-3 bg-brand-primary hover:bg-brand-hover text-white font-bold rounded-lg transition duration-150 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg *ngIf="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Enviar enlace</span>
          </button>
        </form>

        <!-- Back to login link -->
        <div class="mt-6 text-center">
          <a routerLink="/login" class="inline-flex items-center space-x-2 text-xs text-brand-text hover:underline focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Volver al inicio de sesión</span>
          </a>
        </div>
      </div>
    </div>
  `
})
export class RecoverPasswordComponent {
  recoverForm: FormGroup;
  submitted = false;
  loading = false;
  successMessage = false;

  constructor(private fb: FormBuilder) {
    this.recoverForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() {
    return this.recoverForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.successMessage = false;

    if (this.recoverForm.invalid) {
      return;
    }

    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.successMessage = true;
    }, 1500); // Simulate API latency
  }
}
