import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="iam-screen">
      <div class="iam-card px-8 py-8 sm:px-10">
        <div class="text-center">
          <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-primary/20 border border-brand-primary/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-brand-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m0-6a2 2 0 100-4 2 2 0 000 4zm-6 9h12a2 2 0 002-2v-8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-white">Restablecer contraseña</h1>
          <p class="mt-3 text-sm text-gray-400">Usa el token generado para crear una nueva contraseña.</p>
        </div>

        <div class="my-6 h-px bg-dark-border"></div>

        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <div>
            <label class="iam-label" for="token">Token de recuperación</label>
            <input id="token" type="text" formControlName="token" placeholder="Pega aquí el token" class="iam-input font-mono text-sm" [ngClass]="{ 'border-red-500 focus:border-red-500': submitted && f['token'].invalid }" />
            <p *ngIf="submitted && f['token'].errors" class="mt-1 text-xs text-red-400">El token es obligatorio.</p>
          </div>

          <div>
            <label class="iam-label" for="newPassword">Nueva contraseña</label>
            <input id="newPassword" type="password" formControlName="newPassword" placeholder="••••••••" class="iam-input" [ngClass]="{ 'border-red-500 focus:border-red-500': submitted && f['newPassword'].invalid }" />
            <p *ngIf="submitted && f['newPassword'].errors" class="mt-1 text-xs text-red-400">
              <span *ngIf="f['newPassword'].errors?.['required']">La contraseña es obligatoria.</span>
              <span *ngIf="f['newPassword'].errors?.['minlength']">Debe tener al menos 6 caracteres.</span>
            </p>
          </div>

          <div>
            <label class="iam-label" for="confirmPassword">Confirmar nueva contraseña</label>
            <input id="confirmPassword" type="password" formControlName="confirmPassword" placeholder="••••••••" class="iam-input" [ngClass]="{ 'border-red-500 focus:border-red-500': submitted && resetForm.errors?.['mismatch'] }" />
            <p *ngIf="submitted && resetForm.errors?.['mismatch']" class="mt-1 text-xs text-red-400">Las contraseñas no coinciden.</p>
          </div>

          <div *ngIf="errorMessage" class="rounded-xl border border-red-900 bg-status-rejected-bg/80 p-4 text-sm text-gray-100">
            <p class="font-semibold text-white">No se pudo restablecer la contraseña.</p>
            <p class="mt-1 text-xs text-gray-300">{{ errorMessage }}</p>
          </div>

          <div *ngIf="successMessage" class="rounded-xl border border-status-completed-bg bg-status-completed-bg/15 p-4 text-sm text-status-completed-text">
            <p class="font-semibold text-white">Contraseña actualizada.</p>
            <p class="mt-1 text-gray-200">Ya puedes iniciar sesión con la nueva contraseña.</p>
          </div>

          <button type="submit" [disabled]="loading" class="iam-button-primary flex items-center justify-center gap-2">
            <svg *ngIf="loading" class="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Actualizar contraseña</span>
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
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';
  successMessage = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      token: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.resetForm.patchValue({ token });
    }
  }

  get f() {
    return this.resetForm.controls;
  }

  passwordMatchValidator(control: AbstractControl) {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = false;

    if (this.resetForm.invalid) {
      return;
    }

    this.loading = true;
    const values = this.resetForm.getRawValue() as {
      token: string;
      newPassword: string;
      confirmPassword: string;
    };

    this.authService.resetPassword(values.token, values.newPassword).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = true;
        setTimeout(() => void this.router.navigate(['/login']), 1500);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message ?? 'No se pudo procesar el token.';
      }
    });
  }
}
