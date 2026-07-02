import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="iam-panel p-6">
      <div class="mb-6">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-brand-text">IAM</p>
        <h1 class="mt-2 text-2xl font-bold text-white">Cambiar contraseña</h1>
        <p class="mt-2 text-sm text-gray-400">Actualiza tu clave y revocaremos las sesiones activas.</p>
      </div>

      <form [formGroup]="changePasswordForm" (ngSubmit)="onSubmit()" class="grid gap-5 md:grid-cols-2">
        <div class="md:col-span-2">
          <label class="iam-label" for="currentPassword">Contraseña actual</label>
          <input id="currentPassword" type="password" formControlName="currentPassword" class="iam-input" [ngClass]="{ 'border-red-500 focus:border-red-500': submitted && f['currentPassword'].invalid }" />
          <p *ngIf="submitted && f['currentPassword'].errors" class="mt-1 text-xs text-red-400">La contraseña actual es obligatoria.</p>
        </div>

        <div>
          <label class="iam-label" for="newPassword">Nueva contraseña</label>
          <input id="newPassword" type="password" formControlName="newPassword" class="iam-input" [ngClass]="{ 'border-red-500 focus:border-red-500': submitted && f['newPassword'].invalid }" />
          <p *ngIf="submitted && f['newPassword'].errors" class="mt-1 text-xs text-red-400">
            <span *ngIf="f['newPassword'].errors?.['required']">La nueva contraseña es obligatoria.</span>
            <span *ngIf="f['newPassword'].errors?.['minlength']">Debe tener al menos 6 caracteres.</span>
          </p>
        </div>

        <div>
          <label class="iam-label" for="confirmPassword">Confirmar nueva contraseña</label>
          <input id="confirmPassword" type="password" formControlName="confirmPassword" class="iam-input" [ngClass]="{ 'border-red-500 focus:border-red-500': submitted && changePasswordForm.errors?.['mismatch'] }" />
          <p *ngIf="submitted && changePasswordForm.errors?.['mismatch']" class="mt-1 text-xs text-red-400">Las contraseñas no coinciden.</p>
        </div>

        <div *ngIf="errorMessage" class="md:col-span-2 rounded-xl border border-red-900 bg-status-rejected-bg/80 p-4 text-sm text-gray-100">
          <p class="font-semibold text-white">No se pudo cambiar la contraseña.</p>
          <p class="mt-1 text-xs text-gray-300">{{ errorMessage }}</p>
        </div>

        <div *ngIf="successMessage" class="md:col-span-2 rounded-xl border border-status-completed-bg bg-status-completed-bg/15 p-4 text-sm text-status-completed-text">
          <p class="font-semibold text-white">Contraseña actualizada.</p>
          <p class="mt-1 text-gray-200">La sesión se cerrará por seguridad.</p>
        </div>

        <div class="md:col-span-2 flex flex-col gap-3 sm:flex-row">
          <button type="submit" [disabled]="loading" class="iam-button-primary sm:w-auto sm:px-6">
            Cambiar contraseña
          </button>
          <button type="button" (click)="resetForm()" class="iam-button-secondary sm:w-auto sm:px-6">
            Limpiar
          </button>
        </div>
      </form>
    </div>
  `
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';
  successMessage = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  get f() {
    return this.changePasswordForm.controls;
  }

  passwordMatchValidator(group: AbstractControl) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  resetForm(): void {
    this.changePasswordForm.reset();
    this.submitted = false;
    this.errorMessage = '';
    this.successMessage = false;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = false;

    if (this.changePasswordForm.invalid) {
      return;
    }

    this.loading = true;
    const { currentPassword, newPassword } = this.changePasswordForm.getRawValue() as {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    };

    this.authService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = true;
        this.authService.clearSession();
        setTimeout(() => void this.router.navigate(['/login']), 1400);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message ?? 'No se pudo cambiar la contraseña.';
      }
    });
  }
}
