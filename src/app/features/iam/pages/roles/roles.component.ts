import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../../../core/services/role.service';
import { RoleResponse } from '../../../../core/models/iam.models';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="iam-panel p-6">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-brand-text">IAM</p>
        <h1 class="mt-2 text-2xl font-bold text-white">Roles y permisos</h1>
        <p class="mt-2 text-sm text-gray-400">Catálogo de autorización del backend, en formato de permisos finos.</p>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <div class="iam-panel p-5">
          <p class="text-[10px] uppercase tracking-[0.16em] text-gray-500">Roles cargados</p>
          <p class="mt-2 text-3xl font-bold text-white">{{ roles.length }}</p>
        </div>
        <div class="iam-panel p-5">
          <p class="text-[10px] uppercase tracking-[0.16em] text-gray-500">Permisos distintos</p>
          <p class="mt-2 text-3xl font-bold text-white">{{ permissions.length }}</p>
        </div>
        <div class="iam-panel p-5">
          <p class="text-[10px] uppercase tracking-[0.16em] text-gray-500">Permiso activo</p>
          <p class="mt-2 text-sm font-semibold text-brand-text">{{ activePermission }}</p>
        </div>
      </div>

      <div class="iam-panel p-6">
        <div class="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 class="text-lg font-semibold text-white">Lista de roles</h2>
            <p class="text-sm text-gray-400">Cada rol expone permisos como role:read, user:*, profile:*, password:* y token:*</p>
          </div>
          <input
            type="text"
            [value]="searchTerm"
            (input)="searchTerm = ($any($event.target).value)"
            placeholder="Buscar rol"
            class="iam-input md:max-w-xs"
          />
        </div>

        <div *ngIf="loading" class="rounded-xl border border-dark-border bg-dark-input/20 p-6 text-sm text-gray-400">Cargando roles...</div>

        <div *ngIf="!loading" class="grid gap-4 lg:grid-cols-2">
          <div *ngFor="let role of filteredRoles()" class="rounded-xl border border-dark-border bg-dark-input/20 p-5">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-[10px] uppercase tracking-[0.16em] text-gray-500">Rol</p>
                <h3 class="mt-1 text-xl font-bold text-white">{{ role.role }}</h3>
              </div>
              <span class="rounded-full border border-brand-primary/30 bg-brand-primary/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-text">
                {{ role.permissions.length }} permisos
              </span>
            </div>

            <div class="mt-4 flex flex-wrap gap-2">
              <span *ngFor="let permission of role.permissions" class="rounded-full border border-dark-border bg-dark-card px-3 py-1 text-[11px] text-gray-300">
                {{ permission }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RolesComponent implements OnInit {
  roles: RoleResponse[] = [];
  permissions: string[] = [];
  loading = false;
  searchTerm = '';
  activePermission = 'role:read';

  constructor(private roleService: RoleService) {}

  ngOnInit(): void {
    this.loading = true;
    this.activePermission = 'role:read';

    this.roleService.findAll().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

    this.roleService.findAllPermissions().subscribe({
      next: (permissions) => {
        this.permissions = permissions;
        this.activePermission = permissions[0] ?? 'role:read';
      }
    });
  }

  filteredRoles(): RoleResponse[] {
    const query = this.searchTerm.trim().toLowerCase();
    if (!query) {
      return this.roles;
    }

    return this.roles.filter(role =>
      role.role.toLowerCase().includes(query)
      || role.permissions.some(permission => permission.toLowerCase().includes(query))
    );
  }
}
