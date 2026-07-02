import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="iam-screen">
      <div class="iam-card px-8 py-8 sm:px-10">
        <div class="text-center">
          <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-primary shadow-lg shadow-blue-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold tracking-tight text-white">CrediTrack</h1>
          <p class="text-xs text-gray-500">Internal Banking</p>
          <p class="mt-3 text-sm text-gray-400">Acceso al sistema IAM</p>
        </div>

        <div class="my-6 h-px bg-dark-border"></div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <div>
            <label class="iam-label" for="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              placeholder="asesor@banco.com.pe"
              class="iam-input"
              [ngClass]="{ 'border-red-500 focus:border-red-500': submitted && f['email'].invalid }"
            />
            <p *ngIf="submitted && f['email'].errors" class="mt-1 text-xs text-red-400">
              <span *ngIf="f['email'].errors?.['required']">El correo es obligatorio.</span>
              <span *ngIf="f['email'].errors?.['email']">Ingresa un correo válido.</span>
            </p>
          </div>

          <div>
            <label class="iam-label" for="password">Contraseña</label>
            <div class="relative">
              <input
                id="password"
                [type]="showPassword ? 'text' : 'password'"
                formControlName="password"
                placeholder="••••••••"
                class="iam-input pr-12"
                [ngClass]="{ 'border-red-500 focus:border-red-500': submitted && f['password'].invalid }"
              />
              <button
                type="button"
                (click)="togglePasswordVisibility()"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-300"
              >
                <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p *ngIf="submitted && f['password'].errors" class="mt-1 text-xs text-red-400">
              La contraseña es obligatoria.
            </p>
          </div>

          <div *ngIf="loginError" class="rounded-xl border border-red-900 bg-status-rejected-bg/80 p-4 text-sm text-gray-100">
            <p class="font-semibold text-white">No se pudo iniciar sesión.</p>
            <p class="mt-1 text-xs text-gray-300">{{ loginError }}</p>
          </div>

          <div class="flex items-center justify-between text-xs text-gray-400">
            <label class="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                formControlName="keepSignedIn"
                class="h-4 w-4 rounded border-dark-border bg-dark-input text-brand-primary focus:ring-0 focus:ring-offset-0"
              />
              <span>Mantener sesión</span>
            </label>
            <a routerLink="/recover-password" class="font-medium text-brand-text hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button type="submit" [disabled]="loading" class="iam-button-primary flex items-center justify-center gap-2">
            <svg *ngIf="loading" class="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Iniciar sesión</span>
          </button>
        </form>

        <p class="mt-6 text-center text-xs text-gray-400">
          ¿No tienes una cuenta?
          <a routerLink="/register" class="font-semibold text-brand-text hover:underline">Solicitar acceso</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  loading = false;
  showPassword = false;
  loginError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      keepSignedIn: [true]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    this.loginError = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const { email, password } = this.loginForm.getRawValue() as {
      email: string;
      password: string;
      keepSignedIn: boolean;
    };

    this.authService.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        void this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loading = false;
        this.loginError = error?.error?.message ?? 'Credenciales inválidas.';
      }
    });
  }
}
