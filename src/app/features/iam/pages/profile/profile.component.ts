import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../../../core/services/profile.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ProfileResponse } from '../../../../core/models/iam.models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="iam-panel p-6">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-brand-text">IAM</p>
            <h1 class="mt-2 text-2xl font-bold text-white">Mi perfil</h1>
            <p class="mt-2 text-sm text-gray-400">Actualiza tu información personal sin tocar credenciales.</p>
          </div>

          <div class="grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl border border-dark-border bg-dark-input/30 px-4 py-3">
              <p class="text-[10px] uppercase tracking-[0.16em] text-gray-500">Usuario</p>
              <p class="mt-1 text-sm font-semibold text-white">{{ profile?.username || authService.getUsername() }}</p>
            </div>
            <div class="rounded-xl border border-dark-border bg-dark-input/30 px-4 py-3">
              <p class="text-[10px] uppercase tracking-[0.16em] text-gray-500">Rol</p>
              <p class="mt-1 text-sm font-semibold text-white">{{ profile?.role || authService.getRole() }}</p>
            </div>
            <div class="rounded-xl border border-dark-border bg-dark-input/30 px-4 py-3">
              <p class="text-[10px] uppercase tracking-[0.16em] text-gray-500">Estado</p>
              <p class="mt-1 text-sm font-semibold" [ngClass]="profile?.enabled ? 'text-status-completed-text' : 'text-status-rejected-text'">
                {{ profile ? (profile.enabled ? 'Activo' : 'Inactivo') : 'Cargando' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="iam-panel p-6">
        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="grid gap-5 md:grid-cols-2">
          <div>
            <label class="iam-label" for="firstName">Nombres</label>
            <input id="firstName" type="text" formControlName="firstName" class="iam-input" />
          </div>

          <div>
            <label class="iam-label" for="lastName">Apellidos</label>
            <input id="lastName" type="text" formControlName="lastName" class="iam-input" />
          </div>

          <div>
            <label class="iam-label" for="documentType">Tipo de documento</label>
            <select id="documentType" formControlName="documentType" class="iam-input cursor-pointer">
              <option value="DNI">DNI</option>
              <option value="RUC">RUC</option>
              <option value="CE">CE</option>
            </select>
          </div>

          <div>
            <label class="iam-label" for="documentNumber">Número de documento</label>
            <input id="documentNumber" type="text" formControlName="documentNumber" class="iam-input" />
          </div>

          <div class="md:col-span-2">
            <label class="iam-label" for="phoneNumber">Teléfono</label>
            <input id="phoneNumber" type="text" formControlName="phoneNumber" class="iam-input" />
          </div>

          <div *ngIf="message" class="md:col-span-2 rounded-xl border px-4 py-3 text-sm" [ngClass]="success ? 'border-status-completed-bg bg-status-completed-bg/15 text-status-completed-text' : 'border-red-900 bg-status-rejected-bg/80 text-gray-100'">
            <p class="font-semibold text-white">{{ success ? 'Perfil actualizado.' : 'Error' }}</p>
            <p class="mt-1 text-xs text-gray-300">{{ message }}</p>
          </div>

          <div class="md:col-span-2 flex items-center gap-3">
            <button type="submit" [disabled]="loading" class="iam-button-primary sm:w-auto sm:px-6">Guardar cambios</button>
            <button type="button" (click)="reload()" class="iam-button-secondary sm:w-auto sm:px-6">Recargar</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  profile: ProfileResponse | null = null;
  loading = false;
  message = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    public authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      documentType: ['DNI', Validators.required],
      documentNumber: ['', Validators.required],
      phoneNumber: ['']
    });
  }

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.loading = true;
    this.message = '';
    this.success = false;

    this.profileService.findMyProfile().subscribe({
      next: (profile) => {
        this.loading = false;
        this.profile = profile;
        this.profileForm.patchValue({
          firstName: profile.firstName ?? '',
          lastName: profile.lastName ?? '',
          documentType: profile.documentType ?? 'DNI',
          documentNumber: profile.documentNumber ?? '',
          phoneNumber: profile.phoneNumber ?? ''
        });
      },
      error: (error) => {
        this.loading = false;
        this.message = error?.error?.message ?? 'No se pudo cargar el perfil.';
        this.success = false;
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.message = 'Completa los campos obligatorios.';
      this.success = false;
      return;
    }

    this.loading = true;
    this.message = '';
    this.success = false;

    const values = this.profileForm.getRawValue() as {
      firstName: string;
      lastName: string;
      documentType: string;
      documentNumber: string;
      phoneNumber: string;
    };

    this.profileService.updateMyProfile({
      firstName: values.firstName,
      lastName: values.lastName,
      documentType: values.documentType,
      documentNumber: values.documentNumber,
      phoneNumber: values.phoneNumber || null
    }).subscribe({
      next: (profile) => {
        this.loading = false;
        this.profile = profile;
        this.success = true;
        this.message = 'Los cambios se guardaron correctamente.';
      },
      error: (error) => {
        this.loading = false;
        this.success = false;
        this.message = error?.error?.message ?? 'No se pudo actualizar el perfil.';
      }
    });
  }
}
