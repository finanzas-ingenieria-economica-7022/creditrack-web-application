import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-simulation-indicators',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      
      <!-- Header / Breadcrumbs -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="text-xs text-gray-500">
          <span>Simulaciones</span>
          <span class="mx-2">&gt;</span>
          <span>TRX-{{ getTrxId() }} — {{ getCustomerName() }}</span>
          <span class="mx-2">&gt;</span>
          <span class="text-white font-semibold">Indicadores financieros</span>
        </div>

        <button
          type="button"
          (click)="onBack()"
          class="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-dark-border text-gray-300 font-semibold text-xs rounded-lg flex items-center space-x-1.5 transition duration-150 shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Volver al cronograma</span>
        </button>
      </div>

      <!-- Financial Analysis Info Box -->
      <div class="bg-blue-950/20 border border-blue-600/30 rounded-xl p-5 flex items-start space-x-3.5 text-sm text-blue-200">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-brand-text flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        <div class="space-y-1">
          <h4 class="font-bold text-white text-sm">Análisis de Viabilidad Financiera</h4>
          <p class="text-gray-400 text-xs leading-relaxed">
            Los indicadores mostrados asumen un escenario base sin variaciones en la tasa de fondeo. El cálculo de la TIR considera flujos mensuales vencidos según cronograma proyectado.
          </p>
        </div>
      </div>

      <!-- Main split layout (VAN & TIR) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- VALOR ACTUAL NETO (VAN) Panel -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-6 flex flex-col justify-between h-full min-h-[350px]">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xs font-semibold text-gray-400 tracking-wider uppercase">Valor Actual Neto (VAN)</h3>
              <span class="text-gray-500 font-bold text-base">Σ</span>
            </div>
            
            <span class="text-[10px] text-gray-500">Tasa de descuento aplicada: {{ getCokRateText() }}% (WACC interno)</span>
            
            <div class="my-6">
              <div class="text-3xl font-bold text-white">
                {{ formatCurrencySymbol() }} {{ formatNumber(simulation.van) }}
              </div>
              
              <!-- Viability Badge -->
              <span
                class="inline-block mt-2 px-2.5 py-0.5 rounded text-[9px] font-bold tracking-wider"
                [ngClass]="getVanViabilityClass()"
              >
                {{ getVanViabilityLabel() }}
              </span>
            </div>
          </div>

          <!-- Applied Formula container -->
          <div class="bg-dark-input/30 border border-dark-border rounded-lg p-4 font-mono text-[10px] text-gray-500 space-y-1">
            <span class="font-bold text-gray-400 uppercase tracking-wider block mb-1">Fórmula Aplicada</span>
            <div>VAN = Σ [ FC_t / (1 + r)^t ] - I_0</div>
            <div>Donde r = {{ getCokRateText() }}%, t = 1..{{ simulation.termMonths }}</div>
          </div>
        </div>

        <!-- TASA INTERNA DE RETORNO (TIR) Panel -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-6 space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-semibold text-gray-400 tracking-wider uppercase">Tasa Interna de Retorno (TIR)</h3>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          
          <span class="text-[10px] text-gray-500 block -mt-4">Rendimiento proyectado de los flujos de caja libre</span>

          <div class="grid grid-cols-2 gap-4 pb-2">
            <!-- TIR MENSUAL -->
            <div>
              <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Tir Mensual</span>
              <div class="text-2xl font-bold text-accent-gold">{{ formatPercentage(simulation.tir) }}%</div>
            </div>

            <!-- TEA EQUIVALENTE -->
            <div>
              <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">TEA Equivalente</span>
              <div class="text-2xl font-bold text-brand-text">{{ formatPercentage(simulation.tea) }}%</div>
            </div>
          </div>

          <!-- COMPARATIVA DE RENDIMIENTO & Alert warning -->
          <div class="border-t border-dark-border pt-4 space-y-4">
            <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Comparativa de Rendimiento</span>
            
            <!-- Slider simulation bar -->
            <div class="space-y-1.5">
              <div class="relative h-2 bg-gray-800 rounded-full">
                <!-- Project Marker -->
                <div
                  class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4.5 h-4.5 rounded-full bg-accent-gold border-2 border-dark-card shadow flex items-center justify-center cursor-pointer"
                  [style.left.%]="getProjectPercentagePosition()"
                ></div>
                <!-- Target Line -->
                <div class="absolute top-0 bottom-0 w-0.5 bg-gray-600" [style.left.%]="getTargetPercentagePosition()"></div>
              </div>
              
              <div class="flex justify-between text-[8px] text-gray-600 font-bold uppercase tracking-wider px-1">
                <span>Proyecto: {{ formatPercentage(simulation.tea) }}%</span>
                <span>Objetivo (WACC): {{ getCokRateText() }}%</span>
              </div>
            </div>

            <!-- Warning notice if below standard -->
            <div *ngIf="isBelowTarget()" class="bg-yellow-950/20 border border-yellow-700/20 rounded-lg p-3 text-[10px] text-yellow-500 flex items-start space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>
                La TEA equivalente se encuentra {{ getBpsDifference() }} pbs por debajo de la tasa objetivo departamental. Requiere revisión de condiciones de riesgo.
              </span>
            </div>
          </div>

          <!-- Formula box -->
          <div class="bg-dark-input/30 border border-dark-border rounded-lg p-4 font-mono text-[10px] text-gray-500 space-y-1">
            <span class="font-bold text-gray-400 uppercase tracking-wider block mb-1">Conversión TEA</span>
            <div>TEA = (1 + TIR_m)^12 - 1</div>
          </div>
        </div>

      </div>

      <!-- TASA DE COSTO EFECTIVO ANUAL (TCEA) Panel -->
      <div class="border border-brand-primary/20 bg-blue-950/5 rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div class="space-y-4 max-w-2xl">
          <div class="flex items-center space-x-2">
            <h4 class="text-white font-bold text-base tracking-wide">Tasa de Costo Efectivo Anual (TCEA)</h4>
            <span class="px-2 py-0.5 bg-brand-primary/20 border border-brand-primary/30 text-brand-text text-[9px] font-bold rounded">
              REGULATORIO
            </span>
          </div>

          <div class="text-[11px] text-gray-400 space-y-1">
            <div>Tasa Base (TEA): {{ parentFormRate() }}%</div>
            <div>Impacto Seguros y Gastos: +{{ getTceaImpact() }}%</div>
          </div>

          <p class="text-[10px] text-gray-500 leading-relaxed">
            Nota de Advertencia SBS: La TCEA se calcula bajo el supuesto de cumplimiento de todas las obligaciones de pago según el cronograma. Incluye seguro de desgravamen ({{ getDesgravamenRateText() }}% mensual), comisiones estructuración y gastos notariales. El cálculo se rige bajo la Resolución SBS N° 3274-2017 y modificatorias. Las condiciones finales están sujetas a evaluación crediticia al momento del desembolso.
          </p>
        </div>

        <div class="text-right shrink-0">
          <div class="text-xs text-gray-500 font-bold uppercase tracking-wider">TCEA Proyectada</div>
          <div class="text-4xl font-extrabold text-brand-text mt-1">{{ formatPercentage(simulation.tcea) }}%</div>
        </div>
      </div>

    </div>
  `
})
export class SimulationIndicatorsComponent {
  @Input() result!: { simulation: any; schedule: any[] };
  @Input() customerName = '';
  @Input() parentForm!: any;
  @Output() back = new EventEmitter<void>();

  get simulation() {
    return this.result.simulation;
  }

  getTrxId(): string {
    if (!this.simulation.id) return '0091';
    return String(this.simulation.id).padStart(4, '0');
  }

  getCustomerName(): string {
    return this.customerName || 'Cliente';
  }

  getCokRateText(): string {
    const cok = this.simulation.cokRate || 0.125;
    return (cok * 100).toFixed(1);
  }

  getDesgravamenRateText(): string {
    const rate = this.simulation.desgravamenRate || 0.025;
    return rate.toFixed(3);
  }

  parentFormRate(): string {
    return (this.simulation.interestRate || 14).toFixed(2);
  }

  getTceaImpact(): string {
    const tcea = this.simulation.tcea || 0;
    const base = this.simulation.interestRate || 0;
    const diff = Math.max(0, tcea - base);
    return (diff * 100).toFixed(2);
  }

  getVanViabilityLabel(): string {
    const van = this.simulation.van || 0;
    if (van > 0) return '+ VIABLE';
    if (van === 0) return '— NEUTRO';
    return '— NO VIABLE';
  }

  getVanViabilityClass(): string {
    const van = this.simulation.van || 0;
    if (van > 0) {
      return 'bg-status-completed-bg text-status-completed-text border border-status-completed-text/25';
    }
    if (van === 0) {
      return 'bg-gray-800 text-gray-500 border border-gray-700';
    }
    return 'bg-status-rejected-bg text-status-rejected-text border border-status-rejected-text/25';
  }

  // Comparison positions
  getProjectPercentagePosition(): number {
    const tea = this.simulation.tea * 100 || 14.00;
    // Map between 0% and 25% to slider position
    return Math.min(100, Math.max(0, (tea / 25) * 100));
  }

  getTargetPercentagePosition(): number {
    const target = (this.simulation.cokRate || 0.125) * 100;
    return Math.min(100, Math.max(0, (target / 25) * 100));
  }

  isBelowTarget(): boolean {
    const target = (this.simulation.cokRate || 0.125) * 100;
    const tea = this.simulation.tea * 100 || 0;
    return tea < target;
  }

  getBpsDifference(): number {
    const target = (this.simulation.cokRate || 0.125) * 100;
    const tea = this.simulation.tea * 100 || 0;
    const diff = Math.max(0, target - tea);
    return Math.round(diff * 100); // 1% difference = 100 bps
  }

  onBack() {
    this.back.emit();
  }

  formatCurrencySymbol(): string {
    return this.simulation.vehiclePrice <= 35000 ? 'USD' : 'S/';
  }

  formatNumber(val: number): string {
    return new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
  }

  formatPercentage(val: number): string {
    return (val * 100).toFixed(2);
  }
}
