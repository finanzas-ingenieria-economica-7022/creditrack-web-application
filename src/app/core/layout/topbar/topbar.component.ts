import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="h-16 border-b border-dark-border px-6 flex items-center justify-between bg-dark-bg">
      <div>
        <h2 class="text-white text-lg font-medium">Bienvenido, {{ username }}</h2>
      </div>

      <!-- Action items -->
      <div class="flex items-center space-x-4">
        <!-- Notification button -->
        <button class="text-gray-400 hover:text-white transition duration-150 relative">
          <span class="absolute top-0.5 right-0.5 w-2 h-2 bg-brand-primary rounded-full"></span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        <!-- Help Button -->
        <button class="text-gray-400 hover:text-white transition duration-150">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        <!-- Vertical Divider -->
        <div class="h-6 w-px bg-dark-border"></div>

        <!-- User profile details -->
        <div class="flex items-center space-x-3">
          <span class="text-sm font-medium text-gray-300 hidden md:block">{{ username }}</span>
          <div class="w-9 h-9 rounded-full bg-brand-primary/20 border border-brand-primary flex items-center justify-center text-brand-primary font-bold text-sm">
            {{ initials }}
          </div>
        </div>
      </div>
    </header>
  `
})
export class TopbarComponent implements OnInit {
  username: string = 'Carlos';
  initials: string = 'C';

  ngOnInit() {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
      this.initials = storedUsername.substring(0, 2).toUpperCase();
    }
  }
}
