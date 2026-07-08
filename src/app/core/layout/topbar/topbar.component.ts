import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="flex h-16 items-center justify-between border-b border-dark-border bg-dark-bg px-6">
      <div>
        <p class="text-[10px] uppercase tracking-[0.16em] text-gray-500">Sesión activa</p>
        <h2 class="text-lg font-semibold text-white">{{ username }}</h2>
      </div>

      <div class="flex items-center gap-3">
        <div class="hidden flex-col items-end sm:flex">
          <span class="text-sm font-medium text-gray-300">{{ username }}</span>
          <span class="text-[10px] uppercase tracking-[0.16em] text-gray-500">{{ role || 'Sin rol' }}</span>
        </div>

        <div class="flex h-10 w-10 items-center justify-center rounded-full border border-brand-primary bg-brand-primary/20 text-sm font-bold text-brand-text">
          {{ initials }}
        </div>
      </div>
    </header>
  `
})
export class TopbarComponent implements OnInit {
  username = 'Usuario';
  role = '';
  initials = 'U';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername() ?? 'Usuario';
    this.role = this.authService.getRole() ?? '';
    const name = this.username.trim();
    this.initials = name ? name.substring(0, Math.min(2, name.length)).toUpperCase() : 'U';
  }
}
