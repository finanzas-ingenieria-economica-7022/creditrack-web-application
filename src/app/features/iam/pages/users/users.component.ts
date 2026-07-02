import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoleResponse, UserResponse } from '../../../../core/models/iam.models';
import { RoleService } from '../../../../core/services/role.service';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="iam-panel p-6">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-brand-text">IAM</p>
            <h1 class="mt-2 text-2xl font-bold text-white">Usuarios</h1>
            <p class="mt-2 text-sm text-gray-400">CRUD completo de usuarios alineado al backend.</p>
          </div>

          <div class="flex flex-wrap gap-3">
            <button type="button" (click)="reload()" class="iam-button-secondary w-auto px-5 py-3">Recargar</button>
            <button type="button" (click)="openCreate()" class="iam-button-primary w-auto px-5 py-3">Nuevo usuario</button>
          </div>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <div class="iam-panel p-5">
          <p class="text-[10px] uppercase tracking-[0.16em] text-gray-500">Total</p>
          <p class="mt-2 text-3xl font-bold text-white">{{ users.length }}</p>
        </div>
        <div class="iam-panel p-5">
          <p class="text-[10px] uppercase tracking-[0.16em] text-gray-500">Activos</p>
          <p class="mt-2 text-3xl font-bold text-status-completed-text">{{ activeUsersCount() }}</p>
        </div>
        <div class="iam-panel p-5">
          <p class="text-[10px] uppercase tracking-[0.16em] text-gray-500">Roles disponibles</p>
          <p class="mt-2 text-3xl font-bold text-white">{{ roleOptions.length }}</p>
        </div>
      </div>

      <div class="iam-panel p-6">
        <div class="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 class="text-lg font-semibold text-white">Listado</h2>
            <p class="text-sm text-gray-400">Busca por nombre, usuario, correo o rol.</p>
          </div>

          <input
            type="text"
            [value]="searchTerm"
            (input)="searchTerm = ($any($event.target).value)"
            placeholder="Buscar usuario"
            class="iam-input md:max-w-xs"
          />
        </div>

        <div *ngIf="loading" class="rounded-xl border border-dark-border bg-dark-input/20 p-6 text-sm text-gray-400">
          Cargando usuarios...
        </div>

        <div *ngIf="!loading" class="overflow-hidden rounded-xl border border-dark-border">
          <table class="min-w-full divide-y divide-dark-border text-left text-sm">
            <thead class="bg-dark-card text-[10px] uppercase tracking-[0.16em] text-gray-500">
              <tr>
                <th class="px-4 py-3">Usuario</th>
                <th class="px-4 py-3">Contacto</th>
                <th class="px-4 py-3">Rol</th>
                <th class="px-4 py-3">Estado</th>
                <th class="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-dark-border bg-dark-input/10 text-gray-300">
              <tr *ngFor="let user of filteredUsers()">
                <td class="px-4 py-4">
                  <div class="font-semibold text-white">{{ user.firstName }} {{ user.lastName }}</div>
                  <div class="text-xs text-gray-500">{{ user.username }}</div>
                </td>
                <td class="px-4 py-4">
                  <div>{{ user.email }}</div>
                  <div class="text-xs text-gray-500">{{ user.phoneNumber || 'Sin teléfono' }}</div>
                </td>
                <td class="px-4 py-4">
                  <span class="rounded-full border border-brand-primary/30 bg-brand-primary/15 px-3 py-1 text-[11px] font-semibold text-brand-text">
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-4 py-4">
                  <span class="rounded-full px-3 py-1 text-[11px] font-semibold" [ngClass]="user.enabled ? 'bg-status-completed-bg/20 text-status-completed-text' : 'bg-status-rejected-bg/20 text-status-rejected-text'">
                    {{ user.enabled ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="px-4 py-4">
                  <div class="flex justify-end gap-2">
                    <button type="button" (click)="openEdit(user)" class="iam-button-secondary w-auto px-4 py-2 text-xs">Editar</button>
                    <button type="button" (click)="remove(user)" class="rounded-lg border border-red-900 bg-red-950/30 px-4 py-2 text-xs font-semibold text-red-300 hover:bg-red-950/50">Eliminar</button>
                  </div>
                </td>
              </tr>

              <tr *ngIf="filteredUsers().length === 0">
                <td colspan="5" class="px-4 py-8 text-center text-sm text-gray-500">No hay usuarios para mostrar.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="errorMessage" class="mt-4 rounded-xl border border-red-900 bg-status-rejected-bg/80 p-4 text-sm text-gray-100">
          <p class="font-semibold text-white">Error</p>
          <p class="mt-1 text-xs text-gray-300">{{ errorMessage }}</p>
        </div>
      </div>
    </div>

    <div *ngIf="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
      <div class="iam-card iam-card-wide max-h-[90vh] overflow-y-auto px-8 py-8">
        <div class="mb-6 flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-brand-text">IAM</p>
            <h2 class="mt-2 text-xl font-bold text-white">{{ editingUserId ? 'Editar usuario' : 'Nuevo usuario' }}</h2>
            <p class="mt-2 text-sm text-gray-400">Completa el formulario usando la misma nomenclatura del backend.</p>
          </div>
          <button type="button" (click)="closeModal()" class="rounded-lg border border-dark-border bg-dark-input/30 px-3 py-2 text-xs font-semibold text-gray-300 hover:bg-dark-input/60">Cerrar</button>
        </div>

        <form [formGroup]="userForm" (ngSubmit)="save()" class="grid gap-5 md:grid-cols-2">
          <div>
            <label class="iam-label" for="username">Usuario</label>
            <input id="username" type="text" formControlName="username" class="iam-input" />
          </div>

          <div>
            <label class="iam-label" for="email">Correo</label>
            <input id="email" type="email" formControlName="email" class="iam-input" />
          </div>

          <div>
            <label class="iam-label" for="role">Rol</label>
            <select id="role" formControlName="role" class="iam-input cursor-pointer">
              <option *ngFor="let role of roleOptions" [value]="role">{{ role }}</option>
            </select>
          </div>

          <div>
            <label class="iam-label" for="enabled">Estado</label>
            <select id="enabled" formControlName="enabled" class="iam-input cursor-pointer">
              <option [ngValue]="true">Activo</option>
              <option [ngValue]="false">Inactivo</option>
            </select>
          </div>

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

          <div>
            <label class="iam-label" for="phoneNumber">Teléfono</label>
            <input id="phoneNumber" type="text" formControlName="phoneNumber" class="iam-input" />
          </div>

          <div>
            <label class="iam-label" for="password">Contraseña</label>
            <input id="password" type="password" formControlName="password" class="iam-input" [placeholder]="editingUserId ? 'Dejar vacío para no cambiar' : '••••••••'" />
          </div>

          <div *ngIf="formMessage" class="md:col-span-2 rounded-xl border px-4 py-3 text-sm" [ngClass]="formSuccess ? 'border-status-completed-bg bg-status-completed-bg/15 text-status-completed-text' : 'border-red-900 bg-status-rejected-bg/80 text-gray-100'">
            <p class="font-semibold text-white">{{ formSuccess ? 'Operación completada.' : 'Error' }}</p>
            <p class="mt-1 text-xs text-gray-300">{{ formMessage }}</p>
          </div>

          <div class="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button type="button" (click)="closeModal()" class="iam-button-secondary sm:w-auto sm:px-6">Cancelar</button>
            <button type="submit" [disabled]="saving" class="iam-button-primary sm:w-auto sm:px-6">
              {{ saving ? 'Guardando...' : 'Guardar usuario' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class UsersComponent implements OnInit {
  users: UserResponse[] = [];
  roleOptions: string[] = ['ROLE_USER'];
  loading = false;
  saving = false;
  modalOpen = false;
  editingUserId: number | null = null;
  searchTerm = '';
  errorMessage = '';
  formMessage = '';
  formSuccess = false;
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['ROLE_USER', Validators.required],
      enabled: [true],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      documentType: ['DNI', Validators.required],
      documentNumber: ['', Validators.required],
      phoneNumber: [''],
      password: ['']
    });
  }

  ngOnInit(): void {
    this.loadRoles();
    this.reload();
  }

  reload(): void {
    this.loading = true;
    this.errorMessage = '';

    this.userService.findAll().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message ?? 'No se pudo cargar la lista de usuarios.';
      }
    });
  }

  loadRoles(): void {
    this.roleService.findAll().subscribe({
      next: (roles) => {
        this.roleOptions = roles.map(role => role.role);
        if (this.roleOptions.length > 0 && !this.roleOptions.includes(this.userForm.get('role')?.value)) {
          this.userForm.patchValue({ role: this.roleOptions[0] });
        }
      }
    });
  }

  filteredUsers(): UserResponse[] {
    const query = this.searchTerm.trim().toLowerCase();
    if (!query) {
      return this.users;
    }

    return this.users.filter(user =>
      [user.username, user.email, user.role, user.firstName, user.lastName, user.documentNumber]
        .filter((value): value is string => !!value)
        .some(value => value.toLowerCase().includes(query))
    );
  }

  activeUsersCount(): number {
    return this.users.filter(user => user.enabled).length;
  }

  openCreate(): void {
    this.editingUserId = null;
    this.formMessage = '';
    this.formSuccess = false;
    this.modalOpen = true;
    this.userForm.reset({
      username: '',
      email: '',
      role: this.roleOptions[0] ?? 'ROLE_USER',
      enabled: true,
      firstName: '',
      lastName: '',
      documentType: 'DNI',
      documentNumber: '',
      phoneNumber: '',
      password: ''
    });
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
  }

  openEdit(user: UserResponse): void {
    this.editingUserId = user.userId;
    this.formMessage = '';
    this.formSuccess = false;
    this.modalOpen = true;
    this.userForm.reset({
      username: user.username,
      email: user.email,
      role: user.role,
      enabled: user.enabled,
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      documentType: user.documentType ?? 'DNI',
      documentNumber: user.documentNumber ?? '',
      phoneNumber: user.phoneNumber ?? '',
      password: ''
    });
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
  }

  closeModal(): void {
    this.modalOpen = false;
    this.editingUserId = null;
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
  }

  save(): void {
    this.formMessage = '';
    this.formSuccess = false;

    if (this.userForm.invalid) {
      this.formMessage = 'Completa los campos obligatorios.';
      return;
    }

    this.saving = true;
    const values = this.userForm.getRawValue() as {
      username: string;
      email: string;
      role: string;
      enabled: boolean;
      firstName: string;
      lastName: string;
      documentType: string;
      documentNumber: string;
      phoneNumber: string;
      password: string;
    };

    const payload = {
      username: values.username,
      email: values.email,
      role: values.role,
      enabled: values.enabled,
      firstName: values.firstName,
      lastName: values.lastName,
      documentType: values.documentType,
      documentNumber: values.documentNumber,
      phoneNumber: values.phoneNumber || null,
      ...(values.password ? { password: values.password } : {})
    };

    const request$ = this.editingUserId === null
      ? this.userService.create(payload)
      : this.userService.update(this.editingUserId, payload);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.formSuccess = true;
        this.formMessage = this.editingUserId === null ? 'Usuario creado correctamente.' : 'Usuario actualizado correctamente.';
        this.reload();
        setTimeout(() => this.closeModal(), 1200);
      },
      error: (error) => {
        this.saving = false;
        this.formSuccess = false;
        this.formMessage = error?.error?.message ?? 'No se pudo guardar el usuario.';
      }
    });
  }

  remove(user: UserResponse): void {
    const confirmed = window.confirm(`¿Eliminar a ${user.username}?`);
    if (!confirmed) {
      return;
    }

    this.userService.delete(user.userId).subscribe({
      next: () => this.reload(),
      error: (error) => {
        this.errorMessage = error?.error?.message ?? 'No se pudo eliminar el usuario.';
      }
    });
  }
}
