import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  label: string;
  route: string;
  iconSvg: string;
  permissions?: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="flex h-screen w-72 flex-col justify-between border-r border-dark-border bg-dark-bg py-6">
      <div>
        <div class="px-6">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary shadow-lg shadow-blue-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 class="text-lg font-bold tracking-tight text-white">CrediTrack</h1>
              <p class="text-xs text-gray-500">Internal Banking</p>
            </div>
          </div>
        </div>

        <nav class="mt-8 space-y-1 px-3">
          <a
            *ngFor="let item of visibleNavItems()"
            [routerLink]="[item.route]"
            routerLinkActive="bg-gray-800 text-white font-medium border-brand-primary/40"
            [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
            class="group flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-gray-400 transition duration-150 hover:bg-gray-800 hover:text-white"
          >
            <span [innerHTML]="item.iconSvg" class="flex h-5 w-5 items-center justify-center text-gray-400 transition group-hover:text-white"></span>
            <span>{{ item.label }}</span>
          </a>
        </nav>
      </div>

      <div class="px-4">
        <div class="mb-3 rounded-xl border border-dark-border bg-dark-card/80 p-4">
          <p class="text-[10px] uppercase tracking-[0.16em] text-gray-500">Sesión activa</p>
          <p class="mt-1 text-sm font-semibold text-white">{{ username }}</p>
          <p class="text-xs text-gray-500">{{ role || 'Sin rol' }}</p>
        </div>

        <button
          type="button"
          (click)="onLogout()"
          class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-red-400 transition duration-150 hover:bg-red-950/30 hover:text-red-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  username = 'Usuario';
  role = '';

  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      iconSvg: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"/></svg>`
    },
    {
      label: 'Clientes',
      route: '/clientes',
      iconSvg: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`
    },
    {
      label: 'Vehículos',
      route: '/vehiculos',
      iconSvg: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1M21 16V10a2 2 0 00-2-2h-3V6a1 1 0 00-1-1H13m8 11h1a1 1 0 001-1v-4a1 1 0 00-1-1h-1m-1 5a2 2 0 10-4 0M7 16a2 2 0 10-4 0"/></svg>`
    },
    {
      label: 'Simulaciones',
      route: '/simulaciones',
      iconSvg: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>`
    },
    {
      label: 'Historial',
      route: '/historial',
      iconSvg: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
    },
    {
      label: 'Mi perfil',
      route: '/perfil',
      permissions: ['profile:read'],
      iconSvg: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A4 4 0 018.9 15h6.2a4 4 0 013.779 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/></svg>`
    },
    {
      label: 'Cambiar contraseña',
      route: '/cambiar-contrasena',
      permissions: ['password:change'],
      iconSvg: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c.628 0 1.24.098 1.821.284A2 2 0 0116 13.22V14m0 0v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-2m10 0H8m4-5V7a4 4 0 10-8 0v2"/></svg>`
    },
    {
      label: 'Usuarios',
      route: '/usuarios',
      permissions: ['user:read'],
      iconSvg: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`
    },
    {
      label: 'Roles',
      route: '/roles',
      permissions: ['role:read'],
      iconSvg: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/></svg>`
    },
    {
      label: 'Configuración',
      route: '/configuracion',
      iconSvg: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.username = this.authService.getUsername() ?? 'Usuario';
    this.role = this.authService.getRole() ?? '';
  }

  visibleNavItems(): NavItem[] {
    return this.navItems.filter(item => this.authService.hasAnyPermission(item.permissions ?? []));
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => void this.router.navigate(['/login']),
      error: () => void this.router.navigate(['/login'])
    });
  }
}
