import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { FinancialEntityService, FinancialEntity } from '../../../../core/services/financial-entity.service';
import { catchError, of } from 'rxjs';

type SettingsTab = 'perfil' | 'preferencias' | 'seguridad';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6 max-w-5xl">

      <!-- Page Header -->
      <div>
        <h1 class="text-white font-bold text-2xl tracking-wide">Configuracion</h1>
        <p class="text-gray-500 text-sm mt-1">Gestiona tu perfil, preferencias de trabajo y seguridad de la cuenta.</p>
      </div>

      <!-- Tab Navigation -->
      <div class="border-b border-dark-border flex space-x-1">
        <button
          *ngFor="let tab of tabs"
          (click)="activeTab = tab.id"
          [id]="'settings-tab-' + tab.id"
          class="px-4 py-3 text-xs font-bold tracking-widest uppercase transition duration-150 border-b-2 -mb-px"
          [ngClass]="activeTab === tab.id
            ? 'border-brand-primary text-white'
            : 'border-transparent text-gray-500 hover:text-gray-300'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- ========================== TAB: PERFIL ========================== -->
      <div *ngIf="activeTab === 'perfil'">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- Personal Info Card -->
          <div class="lg:col-span-2 bg-dark-card border border-dark-border rounded-xl p-7">
            <h3 class="text-white font-bold text-base mb-6">Informacion personal</h3>

            <!-- Avatar Row -->
            <div class="flex items-center gap-5 pb-6 mb-6 border-b border-dark-border">
              <div
                class="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white shrink-0"
                [style.background]="'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)'"
              >
                {{ getInitials() }}
              </div>
              <div>
                <p class="text-white font-bold">{{ profileForm.get('firstName')?.value }} {{ profileForm.get('lastName')?.value }}</p>
                <p class="text-gray-500 text-xs mt-0.5">Asesor Senior</p>
              </div>
              <button
                type="button"
                class="ml-auto px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-dark-border text-gray-300 text-xs font-semibold rounded-lg transition duration-150"
              >
                Cambiar foto
              </button>
            </div>

            <!-- Profile Form -->
            <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="space-y-5">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Nombres</label>
                  <input
                    id="settings-first-name"
                    type="text"
                    formControlName="firstName"
                    class="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-brand-primary transition duration-150"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Apellidos</label>
                  <input
                    id="settings-last-name"
                    type="text"
                    formControlName="lastName"
                    class="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-brand-primary transition duration-150"
                    placeholder="Tus apellidos"
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">DNI</label>
                  <input
                    id="settings-dni"
                    type="text"
                    formControlName="dni"
                    class="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-brand-primary transition duration-150"
                    placeholder="12345678"
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Correo</label>
                  <input
                    id="settings-email"
                    type="email"
                    formControlName="email"
                    class="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-brand-primary transition duration-150"
                    placeholder="correo@creditrack.com"
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Telefono</label>
                  <input
                    id="settings-phone"
                    type="tel"
                    formControlName="phone"
                    class="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-brand-primary transition duration-150"
                    placeholder="+51 999 000 000"
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Codigo Asesor</label>
                  <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                    <input
                      id="settings-advisor-code"
                      type="text"
                      formControlName="advisorCode"
                      readonly
                      class="w-full pl-9 pr-4 py-2.5 bg-gray-900/60 border border-dark-border rounded-lg text-gray-400 text-sm cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <!-- Success message -->
              <div
                *ngIf="profileSaved"
                class="flex items-center gap-2 text-green-400 text-xs font-semibold bg-green-900/20 border border-green-800/40 rounded-lg px-4 py-2.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Perfil guardado correctamente.
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  (click)="discardProfileChanges()"
                  class="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 border border-dark-border text-gray-300 text-sm font-semibold rounded-lg transition duration-150"
                >
                  Descartar
                </button>
                <button
                  type="submit"
                  [disabled]="profileSaving"
                  class="px-5 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-sm font-bold rounded-lg transition duration-150 flex items-center gap-2 disabled:opacity-50"
                >
                  <div *ngIf="profileSaving" class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>

          <!-- Security Panel (side) -->
          <div class="bg-dark-card border border-dark-border rounded-xl p-7">
            <h3 class="text-white font-bold text-base mb-6">Seguridad</h3>
            <div class="space-y-5">
              <!-- Password -->
              <div class="flex items-start justify-between pb-5 border-b border-dark-border">
                <div>
                  <p class="text-white text-sm font-semibold">Contrasena</p>
                  <p class="text-gray-500 text-xs mt-1">Actualizada hace 30 dias</p>
                </div>
                <button
                  type="button"
                  (click)="activeTab = 'seguridad'"
                  class="px-3.5 py-1.5 bg-gray-800 hover:bg-gray-700 border border-dark-border text-gray-300 text-xs font-semibold rounded-lg transition duration-150 shrink-0"
                >
                  Cambiar
                </button>
              </div>
              <!-- 2FA -->
              <div class="flex items-start justify-between">
                <div>
                  <p class="text-white text-sm font-semibold">Autenticacion 2FA</p>
                  <span class="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold tracking-wider bg-red-900/30 text-red-400 border border-red-800/40">DESACTIVADO</span>
                </div>
                <button
                  type="button"
                  class="px-3.5 py-1.5 bg-gray-800 hover:bg-gray-700 border border-dark-border text-gray-300 text-xs font-semibold rounded-lg transition duration-150 shrink-0"
                >
                  Activar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================== TAB: PREFERENCIAS ========================== -->
      <div *ngIf="activeTab === 'preferencias'" class="space-y-5">

        <!-- Default Simulation Settings -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-7">
          <h3 class="text-white font-bold text-base mb-1">Parametros por Defecto de Simulacion</h3>
          <p class="text-gray-500 text-xs mb-6">Estos valores se pre-cargan en cada nueva simulacion para agilizar tu flujo.</p>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <!-- Default TEA -->
            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">TEA por Defecto (%)</label>
              <input
                id="pref-default-tea"
                type="number"
                [(ngModel)]="prefs.defaultTea"
                step="0.01"
                min="0"
                class="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-brand-primary transition duration-150"
                placeholder="11.00"
              />
            </div>
            <!-- Default COK -->
            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">COK por Defecto (%)</label>
              <input
                id="pref-default-cok"
                type="number"
                [(ngModel)]="prefs.defaultCok"
                step="0.01"
                min="0"
                class="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-brand-primary transition duration-150"
                placeholder="12.00"
              />
            </div>
            <!-- Default Desgravamen -->
            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Desgravamen por Defecto (%)</label>
              <input
                id="pref-default-desgravamen"
                type="number"
                [(ngModel)]="prefs.defaultDesgravamen"
                step="0.001"
                min="0"
                class="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-brand-primary transition duration-150"
                placeholder="0.050"
              />
            </div>
            <!-- Default Seg. Vehicular -->
            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Seg. Vehicular por Defecto (%)</label>
              <input
                id="pref-default-insurance"
                type="number"
                [(ngModel)]="prefs.defaultInsurance"
                step="0.001"
                min="0"
                class="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-brand-primary transition duration-150"
                placeholder="0.300"
              />
            </div>
            <!-- Default Portes -->
            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Portes por Defecto (S/)</label>
              <input
                id="pref-default-portes"
                type="number"
                [(ngModel)]="prefs.defaultPortes"
                step="0.5"
                min="0"
                class="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-brand-primary transition duration-150"
                placeholder="10.00"
              />
            </div>
            <!-- Default Plazo -->
            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Plazo por Defecto (meses)</label>
              <select
                id="pref-default-term"
                [(ngModel)]="prefs.defaultTerm"
                class="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-brand-primary transition duration-150"
              >
                <option value="12">12 meses</option>
                <option value="24">24 meses</option>
                <option value="36">36 meses</option>
                <option value="48">48 meses</option>
                <option value="60">60 meses</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Entidad Financiera por Defecto -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-7">
          <h3 class="text-white font-bold text-base mb-1">Entidad Financiera Preferida</h3>
          <p class="text-gray-500 text-xs mb-6">Selecciona el banco que se pre-carga por defecto al iniciar una nueva simulacion.</p>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              *ngFor="let entity of financialEntities"
              (click)="prefs.defaultBankId = entity.id"
              [id]="'pref-bank-' + entity.id"
              class="p-4 rounded-xl border cursor-pointer transition duration-150"
              [ngClass]="prefs.defaultBankId === entity.id
                ? 'border-brand-primary bg-brand-primary/10'
                : 'border-dark-border bg-dark-input hover:border-gray-600'"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
                  [ngClass]="prefs.defaultBankId === entity.id ? 'bg-brand-primary' : 'bg-gray-700'"
                >
                  {{ entity.name.substring(0, 2).toUpperCase() }}
                </div>
                <div>
                  <p class="text-white text-sm font-semibold">{{ entity.name }}</p>
                  <p class="text-gray-500 text-[10px]">TEA: {{ (entity.standardTea * 100).toFixed(2) }}%</p>
                </div>
                <div *ngIf="prefs.defaultBankId === entity.id" class="ml-auto text-brand-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Apariencia -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-7">
          <h3 class="text-white font-bold text-base mb-1">Apariencia</h3>
          <p class="text-gray-500 text-xs mb-6">Personaliza como se ve la interfaz de CrediTrack.</p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <!-- Currency Default -->
            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Moneda por Defecto</label>
              <div class="flex gap-2">
                <button
                  type="button"
                  id="pref-currency-pen"
                  (click)="prefs.defaultCurrency = 'PEN'"
                  class="flex-1 py-2.5 rounded-lg text-sm font-bold border transition duration-150"
                  [ngClass]="prefs.defaultCurrency === 'PEN' ? 'bg-brand-primary border-brand-primary text-white' : 'bg-dark-input border-dark-border text-gray-400 hover:border-gray-600'"
                >
                  S/ Soles
                </button>
                <button
                  type="button"
                  id="pref-currency-usd"
                  (click)="prefs.defaultCurrency = 'USD'"
                  class="flex-1 py-2.5 rounded-lg text-sm font-bold border transition duration-150"
                  [ngClass]="prefs.defaultCurrency === 'USD' ? 'bg-brand-primary border-brand-primary text-white' : 'bg-dark-input border-dark-border text-gray-400 hover:border-gray-600'"
                >
                  $ Dolares
                </button>
              </div>
            </div>
            <!-- Formato de Fecha -->
            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Formato de Fecha</label>
              <select
                id="pref-date-format"
                [(ngModel)]="prefs.dateFormat"
                class="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-brand-primary transition duration-150"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Save Prefs -->
        <div *ngIf="prefsSaved" class="flex items-center gap-2 text-green-400 text-xs font-semibold bg-green-900/20 border border-green-800/40 rounded-lg px-4 py-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Preferencias guardadas correctamente.
        </div>

        <div class="flex justify-end gap-3">
          <button
            type="button"
            (click)="discardPrefs()"
            class="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 border border-dark-border text-gray-300 text-sm font-semibold rounded-lg transition duration-150"
          >
            Descartar
          </button>
          <button
            type="button"
            id="prefs-save-btn"
            (click)="savePrefs()"
            class="px-5 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-sm font-bold rounded-lg transition duration-150"
          >
            Guardar preferencias
          </button>
        </div>
      </div>

      <!-- ========================== TAB: SEGURIDAD ========================== -->
      <div *ngIf="activeTab === 'seguridad'" class="space-y-5">

        <!-- Change Password -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-7">
          <h3 class="text-white font-bold text-base mb-1">Cambiar Contrasena</h3>
          <p class="text-gray-500 text-xs mb-6">Ingresa tu contrasena actual y elige una nueva contrasena segura.</p>

          <form [formGroup]="passwordForm" (ngSubmit)="savePassword()" class="space-y-5 max-w-md">
            <!-- Current Password -->
            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Contrasena Actual</label>
              <div class="relative">
                <input
                  id="settings-current-password"
                  [type]="showCurrentPwd ? 'text' : 'password'"
                  formControlName="currentPassword"
                  class="w-full px-4 pr-10 py-2.5 bg-dark-input border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-brand-primary transition duration-150"
                  [ngClass]="{'border-red-600': passwordSubmitted && passwordForm.get('currentPassword')?.invalid}"
                  placeholder="••••••••"
                />
                <button type="button" (click)="showCurrentPwd = !showCurrentPwd" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300">
                  <svg *ngIf="!showCurrentPwd" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  <svg *ngIf="showCurrentPwd" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                </button>
              </div>
            </div>

            <!-- New Password -->
            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Nueva Contrasena</label>
              <div class="relative">
                <input
                  id="settings-new-password"
                  [type]="showNewPwd ? 'text' : 'password'"
                  formControlName="newPassword"
                  class="w-full px-4 pr-10 py-2.5 bg-dark-input border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-brand-primary transition duration-150"
                  [ngClass]="{'border-red-600': passwordSubmitted && passwordForm.get('newPassword')?.invalid}"
                  placeholder="Minimo 8 caracteres"
                />
                <button type="button" (click)="showNewPwd = !showNewPwd" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300">
                  <svg *ngIf="!showNewPwd" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  <svg *ngIf="showNewPwd" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                </button>
              </div>
              <!-- Strength bar -->
              <div class="mt-2 flex gap-1" *ngIf="passwordForm.get('newPassword')?.value">
                <div *ngFor="let i of [1,2,3,4]" class="h-1 flex-1 rounded-full transition-all duration-300"
                  [ngClass]="getPasswordStrength() >= i ? getStrengthColor(i) : 'bg-gray-700'"></div>
              </div>
              <p *ngIf="passwordForm.get('newPassword')?.value" class="text-[10px] mt-1" [ngClass]="getStrengthTextColor()">
                {{ getStrengthLabel() }}
              </p>
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Confirmar Nueva Contrasena</label>
              <input
                id="settings-confirm-password"
                [type]="showNewPwd ? 'text' : 'password'"
                formControlName="confirmPassword"
                class="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-brand-primary transition duration-150"
                [ngClass]="{'border-red-600': passwordSubmitted && passwordForm.errors?.['mismatch']}"
                placeholder="Repite tu nueva contrasena"
              />
              <p *ngIf="passwordSubmitted && passwordForm.errors?.['mismatch']" class="text-red-400 text-[10px] mt-1">Las contrasenas no coinciden.</p>
            </div>

            <!-- Feedback messages -->
            <div *ngIf="passwordError" class="flex items-center gap-2 text-red-400 text-xs font-semibold bg-red-900/20 border border-red-800/40 rounded-lg px-4 py-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              {{ passwordError }}
            </div>
            <div *ngIf="passwordSaved" class="flex items-center gap-2 text-green-400 text-xs font-semibold bg-green-900/20 border border-green-800/40 rounded-lg px-4 py-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Contrasena actualizada correctamente.
            </div>

            <div class="flex gap-3 pt-1">
              <button
                type="submit"
                [disabled]="passwordSaving"
                class="px-5 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-sm font-bold rounded-lg transition duration-150 flex items-center gap-2 disabled:opacity-50"
              >
                <div *ngIf="passwordSaving" class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                Actualizar contrasena
              </button>
            </div>
          </form>
        </div>

        <!-- Sesiones Activas -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-7">
          <h3 class="text-white font-bold text-base mb-1">Sesiones Activas</h3>
          <p class="text-gray-500 text-xs mb-6">Dispositivos donde tu cuenta esta actualmente conectada.</p>

          <div class="space-y-3">
            <div *ngFor="let session of activeSessions" class="flex items-center gap-4 p-4 bg-dark-input rounded-xl border border-dark-border">
              <div class="p-2 bg-gray-800 rounded-lg text-gray-400">
                <svg *ngIf="session.device === 'desktop'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <svg *ngIf="session.device === 'mobile'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-white text-sm font-semibold">{{ session.name }}</p>
                <p class="text-gray-500 text-xs">{{ session.location }} &middot; {{ session.lastActive }}</p>
              </div>
              <span *ngIf="session.isCurrent" class="px-2 py-0.5 rounded text-[9px] font-bold bg-green-900/30 text-green-400 border border-green-800/40">ACTUAL</span>
              <button *ngIf="!session.isCurrent" type="button" class="text-xs text-red-400 hover:text-red-300 font-semibold transition duration-150">
                Cerrar
              </button>
            </div>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="bg-dark-card border border-red-900/30 rounded-xl p-7">
          <h3 class="text-red-400 font-bold text-base mb-1">Zona de Peligro</h3>
          <p class="text-gray-500 text-xs mb-5">Estas acciones son irreversibles. Procede con cuidado.</p>
          <div class="flex flex-wrap gap-3">
            <button
              type="button"
              class="px-4 py-2.5 bg-red-900/20 hover:bg-red-900/40 border border-red-800/40 text-red-400 text-sm font-semibold rounded-lg transition duration-150"
            >
              Eliminar historial de simulaciones
            </button>
            <button
              type="button"
              class="px-4 py-2.5 bg-red-900/20 hover:bg-red-900/40 border border-red-800/40 text-red-400 text-sm font-semibold rounded-lg transition duration-150"
            >
              Cerrar sesion en todos los dispositivos
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  activeTab: SettingsTab = 'perfil';

  tabs = [
    { id: 'perfil' as SettingsTab, label: 'Perfil' },
    { id: 'preferencias' as SettingsTab, label: 'Preferencias' },
    { id: 'seguridad' as SettingsTab, label: 'Seguridad' }
  ];

  // Profile tab
  profileForm: FormGroup;
  profileSaving = false;
  profileSaved = false;

  // Security tab
  passwordForm: FormGroup;
  passwordSubmitted = false;
  passwordSaving = false;
  passwordSaved = false;
  passwordError = '';
  showCurrentPwd = false;
  showNewPwd = false;

  // Preferences tab
  financialEntities: FinancialEntity[] = [];
  prefsSaved = false;
  prefs = {
    defaultTea: 11.00,
    defaultCok: 12.00,
    defaultDesgravamen: 0.050,
    defaultInsurance: 0.300,
    defaultPortes: 10.00,
    defaultTerm: 36,
    defaultBankId: undefined as number | undefined,
    defaultCurrency: 'PEN' as 'PEN' | 'USD',
    dateFormat: 'DD/MM/YYYY'
  };
  private _prefsSnapshot = { ...this.prefs };

  activeSessions = [
    { device: 'desktop', name: 'Windows — Chrome 125', location: 'Lima, Peru', lastActive: 'Ahora mismo', isCurrent: true },
    { device: 'mobile', name: 'Android — Chrome Mobile', location: 'Miraflores, Lima', lastActive: 'Hace 2 horas', isCurrent: false }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private financialEntityService: FinancialEntityService
  ) {
    const username = this.authService.getUsername() || '';
    const parts = username.split('.');
    const firstName = parts[0] ? this.capitalize(parts[0]) : 'Carlos';
    const lastName = parts[1] ? this.capitalize(parts[1]) : 'Rios';

    this.profileForm = this.fb.group({
      firstName: [firstName, Validators.required],
      lastName: [lastName, Validators.required],
      dni: ['45789123'],
      email: [username.includes('@') ? username : `${username}@creditrack.com`],
      phone: ['+51 987 654 321'],
      advisorCode: ['ASE-2024-047']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.loadPrefsFromStorage();
    this.financialEntityService.getAll().pipe(catchError(() => of([]))).subscribe((entities) => {
      this.financialEntities = entities;

      const hasInterbank = entities.some(e => e.name.toLowerCase() === 'interbank');
      const hasBcp = entities.some(e => e.name.toLowerCase() === 'bcp');

      if (!hasInterbank) {
        this.financialEntityService.create({ name: 'Interbank', standardTea: 14.0 }).subscribe({
          next: () => this.refreshEntities()
        });
      }

      if (!hasBcp) {
        this.financialEntityService.create({ name: 'BCP', standardTea: 12.5 }).subscribe({
          next: () => this.refreshEntities()
        });
      }

      if (entities.length > 0 && !this.prefs.defaultBankId) {
        this.prefs.defaultBankId = entities[0].id;
      }
    });
  }

  refreshEntities() {
    this.financialEntityService.getAll().pipe(catchError(() => of([]))).subscribe((all) => {
      this.financialEntities = all;
      if (!this.prefs.defaultBankId && all.length > 0) {
        this.prefs.defaultBankId = all[0].id;
      }
    });
  }

  // Helpers
  capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  getInitials(): string {
    const first = this.profileForm.get('firstName')?.value || '';
    const last = this.profileForm.get('lastName')?.value || '';
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  }

  // Profile tab
  saveProfile() {
    this.profileSaving = true;
    this.profileSaved = false;
    setTimeout(() => {
      localStorage.setItem('creditrack_profile', JSON.stringify(this.profileForm.value));
      this.profileSaving = false;
      this.profileSaved = true;
      setTimeout(() => { this.profileSaved = false; }, 3000);
    }, 800);
  }

  discardProfileChanges() {
    const saved = localStorage.getItem('creditrack_profile');
    if (saved) {
      this.profileForm.patchValue(JSON.parse(saved));
    }
  }

  // Preferences tab
  loadPrefsFromStorage() {
    const saved = localStorage.getItem('creditrack_prefs');
    if (saved) {
      try {
        this.prefs = { ...this.prefs, ...JSON.parse(saved) };
        this._prefsSnapshot = { ...this.prefs };
      } catch {}
    }
  }

  savePrefs() {
    localStorage.setItem('creditrack_prefs', JSON.stringify(this.prefs));
    this._prefsSnapshot = { ...this.prefs };
    this.prefsSaved = true;
    setTimeout(() => { this.prefsSaved = false; }, 3000);
  }

  discardPrefs() {
    this.prefs = { ...this._prefsSnapshot };
  }

  // Security tab
  passwordMatchValidator(group: FormGroup) {
    const newPwd = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return newPwd === confirm ? null : { mismatch: true };
  }

  savePassword() {
    this.passwordSubmitted = true;
    this.passwordError = '';
    this.passwordSaved = false;

    if (this.passwordForm.invalid) return;

    this.passwordSaving = true;
    setTimeout(() => {
      this.passwordSaving = false;
      this.passwordSaved = true;
      this.passwordSubmitted = false;
      this.passwordForm.reset();
      setTimeout(() => { this.passwordSaved = false; }, 3000);
    }, 1000);
  }

  getPasswordStrength(): number {
    const pwd: string = this.passwordForm.get('newPassword')?.value || '';
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  }

  getStrengthColor(level: number): string {
    const strength = this.getPasswordStrength();
    if (strength === 1) return 'bg-red-500';
    if (strength === 2) return 'bg-orange-500';
    if (strength === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  getStrengthTextColor(): string {
    const s = this.getPasswordStrength();
    if (s === 1) return 'text-red-400';
    if (s === 2) return 'text-orange-400';
    if (s === 3) return 'text-yellow-400';
    return 'text-green-400';
  }

  getStrengthLabel(): string {
    const s = this.getPasswordStrength();
    if (s === 1) return 'Contrasena debil';
    if (s === 2) return 'Contrasena regular';
    if (s === 3) return 'Contrasena fuerte';
    return 'Contrasena muy fuerte';
  }
}
