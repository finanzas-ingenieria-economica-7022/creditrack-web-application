import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <div class="flex h-screen bg-dark-bg overflow-hidden">
      <!-- Sidebar -->
      <app-sidebar class="flex-shrink-0"></app-sidebar>

      <!-- Main Panel -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Topbar -->
        <app-topbar></app-topbar>

        <!-- Main Content Area -->
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-dark-bg p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class MainLayoutComponent {}
