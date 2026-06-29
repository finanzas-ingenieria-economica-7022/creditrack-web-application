import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-dark-bg px-4">
      <div class="w-full max-w-md bg-dark-card border border-dark-border rounded-xl p-8 shadow-2xl">
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
          <p class="text-sm text-gray-400">Sistema de créditos vehiculares</p>
        </div>

        <hr class="border-dark-border mb-6" />

        <!-- Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <!-- Email Input -->
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

          <!-- Password Input -->
          <div>
            <label class="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">Contraseña</label>
            <div class="relative">
              <input
                [type]="showPassword ? 'text' : 'password'"
                formControlName="password"
                placeholder="••••••••"
                class="w-full px-4 py-3 bg-dark-input border border-dark-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary transition duration-150"
                [ngClass]="{ 'border-red-500 focus:border-red-500': (submitted && f['password'].errors) || loginError }"
              />
              <button
                type="button"
                (click)="togglePasswordVisibility()"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none"
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
            <div *ngIf="submitted && f['password'].errors" class="text-red-500 text-xs mt-1">
              <span *ngIf="f['password'].errors['required']">La contraseña es obligatoria.</span>
            </div>
          </div>

          <!-- Error Alert Card (V02 style) -->
          <div *ngIf="loginError" class="bg-status-rejected-bg border border-red-900 rounded-lg p-4 text-white flex items-start space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-status-rejected-text flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <div class="text-xs">
              <p class="font-bold text-white mb-0.5">Correo o contraseña incorrectos.</p>
              <p class="text-gray-300">Intento {{ attemptCount }} de 5. Tras 5 intentos la cuenta se bloqueará.</p>
            </div>
          </div>

          <!-- Keep Signed In & Forgot Password -->
          <div class="flex items-center justify-between text-xs">
            <label class="flex items-center space-x-2 text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                formControlName="keepSignedIn"
                class="rounded bg-dark-input border-dark-border text-brand-primary focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
              />
              <span>Mantener sesión</span>
            </label>
            <a routerLink="/recover-password" class="text-brand-text hover:underline">¿Olvidaste tu contraseña?</a>
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
            <span>Iniciar sesión</span>
          </button>
        </form>

        <p class="text-center text-xs text-gray-400 mt-6">
          ¿No tienes una cuenta? <a routerLink="/register" class="text-brand-text hover:underline font-semibold">Regístrate aquí</a>
        </p>

        <p class="text-center text-[10px] text-gray-600 mt-6">
          Acceso restringido — uso exclusivo del asesor autorizado
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
  loginError = false;
  attemptCount = 0;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      keepSignedIn: [false]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.submitted = true;
    this.loginError = false;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const emailValue = this.loginForm.value.email;
    const passwordValue = this.loginForm.value.password;

    // Use email as username for authentication endpoint
    this.authService.login(emailValue, passwordValue).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.loginError = true;
        this.attemptCount++;
        if (this.attemptCount >= 5) {
          // Additional lockout visual indicators can go here
        }
      }
    });
  }
}
