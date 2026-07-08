import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ForgotPasswordResponse } from '../../../../core/models/iam.models';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="iam-screen">
      <div class="iam-card px-8 py-8 sm:px-10">
        <div class="text-center">
          <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-primary/20 border border-brand-primary/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-brand-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-white">Recuperar acceso</h1>
          <p class="mt-3 text-sm text-gray-400">Ingresa tu correo y generaremos un token de restablecimiento.</p>
        </div>

        <div class="my-6 h-px bg-dark-border"></div>

        <form [formGroup]="recoverForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <div>
            <label class="iam-label" for="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              placeholder="tu@correo.com"
              class="iam-input"
              [ngClass]="{ 'border-red-500 focus:border-red-500': submitted && f['email'].invalid }"
            />
            <p *ngIf="submitted && f['email'].errors" class="mt-1 text-xs text-red-400">
              <span *ngIf="f['email'].errors?.['required']">El correo es obligatorio.</span>
              <span *ngIf="f['email'].errors?.['email']">Ingresa un correo válido.</span>
            </p>
          </div>

          <div *ngIf="errorMessage" class="rounded-xl border border-red-900 bg-status-rejected-bg/80 p-4 text-sm text-gray-100">
            <p class="font-semibold text-white">No se pudo procesar la solicitud.</p>
            <p class="mt-1 text-xs text-gray-300">{{ errorMessage }}</p>
          </div>

          <div *ngIf="result" class="rounded-xl border border-status-completed-bg bg-status-completed-bg/15 p-4 text-xs text-status-completed-text">
            <p class="font-semibold text-white">Token generado</p>
            <p class="mt-1 text-gray-200">{{ result.message }}</p>
            <div class="mt-3 rounded-lg border border-dark-border bg-dark-input/40 p-3 font-mono text-[11px] text-gray-200 break-all">
              {{ result.resetToken }}
            </div>
            <p class="mt-3 text-gray-400">Vence el {{ result.expiresAt | date:'medium' }}</p>
            <button type="button" (click)="goToReset()" class="mt-4 w-full rounded-lg border border-brand-primary/40 bg-brand-primary/15 px-4 py-2.5 text-sm font-semibold text-brand-text hover:bg-brand-primary/25">
              Ir a restablecer contraseña
            </button>
          </div>

          <button type="submit" [disabled]="loading" class="iam-button-primary flex items-center justify-center gap-2">
            <svg *ngIf="loading" class="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Generar token</span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <a routerLink="/login" class="inline-flex items-center gap-2 text-xs text-brand-text hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Volver al inicio de sesión
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
  errorMessage = '';
  result: ForgotPasswordResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.recoverForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() {
    return this.recoverForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.result = null;

    if (this.recoverForm.invalid) {
      return;
    }

    this.loading = true;
    const { email } = this.recoverForm.getRawValue() as { email: string; };

    this.authService.forgotPassword(email).subscribe({
      next: (response) => {
        this.loading = false;
        this.result = response;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message ?? 'No se pudo generar el token de recuperación.';
      }
    });
  }

  goToReset(): void {
    if (!this.result?.resetToken) {
      return;
    }

    void this.router.navigate(['/reset-password'], { queryParams: { token: this.result.resetToken } });
  }
}
