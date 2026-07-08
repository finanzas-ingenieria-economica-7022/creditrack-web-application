import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-simulation-indicators',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">

      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="text-xs text-gray-500">
          <span>Simulaciones</span>
          <span class="mx-2">&gt;</span>
          <span>{{ result?.code || 'SIM-000001' }}</span>
          <span class="mx-2">&gt;</span>
          <span class="text-white font-semibold">Indicadores financieros</span>
        </div>
        <button type="button" (click)="onBack()"
          class="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-dark-border text-gray-300 font-semibold text-xs rounded-lg flex items-center space-x-1.5 transition duration-150 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
          <span>Volver al cronograma</span>
        </button>
      </div>

      <!-- Info box -->
      <div class="bg-blue-950/20 border border-blue-600/30 rounded-xl p-5 flex items-start space-x-3.5 text-sm text-blue-200">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-brand-text flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        <div class="space-y-1">
          <h4 class="font-bold text-white text-sm">Analisis de Viabilidad Financiera</h4>
          <p class="text-gray-400 text-xs leading-relaxed">Los indicadores mostrados asumen flujos mensuales vencidos segun el cronograma generado. La TIR se calcula mediante biseccion convergente con precision 1e-9. El VAN se descuenta a la tasa COK mensual equivalente.</p>
        </div>
      </div>

      <!-- Rate indicators grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-dark-card border border-dark-border rounded-xl p-5">
          <span class="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">TEA del producto</span>
          <div class="text-2xl font-bold text-white mt-1">{{ formatPct(result?.teaPercent) }}%</div>
        </div>
        <div class="bg-dark-card border border-dark-border rounded-xl p-5">
          <span class="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">TEM equivalente</span>
          <div class="text-2xl font-bold text-accent-gold mt-1">{{ formatPct7(result?.temPercent) }}%</div>
        </div>
        <div class="bg-dark-card border border-dark-border rounded-xl p-5">
          <span class="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">COK TEA</span>
          <div class="text-2xl font-bold text-brand-text mt-1">{{ formatPct(result?.cokTeaPercent) }}%</div>
        </div>
        <div class="bg-dark-card border border-dark-border rounded-xl p-5">
          <span class="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">COK TEM</span>
          <div class="text-2xl font-bold text-brand-text mt-1">{{ formatPct7(result?.cokTemPercent) }}%</div>
        </div>
      </div>

      <!-- Main split layout (VAN & TIR) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- VAN Panel -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-6 flex flex-col justify-between h-full min-h-[350px]">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xs font-semibold text-gray-400 tracking-wider uppercase">Valor Actual Neto (VAN)</h3>
              <span class="text-gray-500 font-bold text-base">Sigma</span>
            </div>
            <span class="text-[10px] text-gray-500">Tasa de descuento: {{ formatPct(result?.cokTeaPercent) }}% (COK anual)</span>
            <div class="my-6">
              <div class="text-3xl font-bold text-white">{{ formatCurrencySymbol() }} {{ formatMoney(result?.van) }}</div>
              <span class="inline-block mt-2 px-2.5 py-0.5 rounded text-[9px] font-bold tracking-wider" [ngClass]="getVanClass()">{{ getVanLabel() }}</span>
            </div>
          </div>
          <div class="bg-dark-input/30 border border-dark-border rounded-lg p-4 font-mono text-[10px] text-gray-500 space-y-1">
            <span class="font-bold text-gray-400 uppercase tracking-wider block mb-1">Formula Aplicada</span>
            <div>VAN = Suma [ FC_t / (1 + r)^t ] - I_0</div>
            <div>Donde r = {{ formatPct7(result?.cokTemPercent) }}% (TEM), t = 1..{{ result?.termMonths }}</div>
          </div>
        </div>

        <!-- TIR & TCEA Panel -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-6 space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-semibold text-gray-400 tracking-wider uppercase">TIR y TCEA</h3>
          </div>
          <div class="grid grid-cols-2 gap-4 pb-2">
            <div>
              <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">TIR Mensual</span>
              <div class="text-2xl font-bold text-accent-gold">{{ formatPct7(result?.tirPercent) }}%</div>
            </div>
            <div>
              <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">TCEA</span>
              <div class="text-2xl font-bold text-brand-text">{{ formatPct(result?.tceaPercent) }}%</div>
            </div>
          </div>
          <div class="border-t border-dark-border pt-4 space-y-2">
            <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Resumen de Costos Totales</span>
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div class="bg-dark-input/30 rounded-lg p-3"><span class="text-gray-500 block">Total Intereses</span><span class="text-white font-bold">{{ formatCurrencySymbol() }} {{ formatMoney(result?.totalInterest) }}</span></div>
              <div class="bg-dark-input/30 rounded-lg p-3"><span class="text-gray-500 block">Total Seguros</span><span class="text-white font-bold">{{ formatCurrencySymbol() }} {{ formatMoney(result?.totalInsurance) }}</span></div>
              <div class="bg-dark-input/30 rounded-lg p-3"><span class="text-gray-500 block">Total Comisiones</span><span class="text-white font-bold">{{ formatCurrencySymbol() }} {{ formatMoney(result?.totalFees) }}</span></div>
              <div class="bg-dark-input/30 rounded-lg p-3"><span class="text-gray-500 block">Total Pagado</span><span class="text-brand-text font-bold">{{ formatCurrencySymbol() }} {{ formatMoney(result?.totalPayment) }}</span></div>
            </div>
          </div>
        </div>

      </div>

      <!-- TCEA banner -->
      <div class="border border-brand-primary/20 bg-blue-950/5 rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div class="space-y-2 max-w-2xl">
          <div class="flex items-center space-x-2">
            <h4 class="text-white font-bold text-base tracking-wide">Tasa de Costo Efectivo Anual (TCEA)</h4>
            <span class="px-2 py-0.5 bg-brand-primary/20 border border-brand-primary/30 text-brand-text text-[9px] font-bold rounded">REGULATORIO</span>
          </div>
          <div class="text-[11px] text-gray-400 space-y-1">
            <div>TEA del producto: {{ formatPct(result?.teaPercent) }}%</div>
            <div>Incremento por cargos y seguros: +{{ getTceaSpread() }}%</div>
          </div>
          <p class="text-[10px] text-gray-500 leading-relaxed">Nota SBS: La TCEA se calcula bajo el supuesto de cumplimiento de todas las obligaciones de pago. Incluye desgravamen, seguros y comisiones. Rige bajo la Resolucion SBS N° 3274-2017.</p>
        </div>
        <div class="text-right shrink-0">
          <div class="text-xs text-gray-500 font-bold uppercase tracking-wider">TCEA Proyectada</div>
          <div class="text-4xl font-extrabold text-brand-text mt-1">{{ formatPct(result?.tceaPercent) }}%</div>
        </div>
      </div>

    </div>
  `
})
export class SimulationIndicatorsComponent {
  @Input() result!: any;
  @Input() customerName = '';
  @Input() parentForm!: any;
  @Output() back = new EventEmitter<void>();

  onBack() { this.back.emit(); }

  getVanLabel(): string {
    const v = Number(this.result?.van || 0);
    if (v > 0) return '+ VIABLE';
    if (v === 0) return '-- NEUTRO';
    return '-- NO VIABLE';
  }

  getVanClass(): string {
    const v = Number(this.result?.van || 0);
    if (v > 0) return 'bg-status-completed-bg text-status-completed-text border border-status-completed-text/25';
    if (v === 0) return 'bg-gray-800 text-gray-500 border border-gray-700';
    return 'bg-status-rejected-bg text-status-rejected-text border border-status-rejected-text/25';
  }

  getTceaSpread(): string {
    const tcea = Number(this.result?.tceaPercent || 0);
    const tea = Number(this.result?.teaPercent || 0);
    return Math.max(0, tcea - tea).toFixed(4);
  }

  formatCurrencySymbol(): string { return this.result?.currency === 'USD' ? 'USD' : 'S/'; }
  formatMoney(val: any): string { if (val == null) return '0.00'; return new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(val)); }
  formatPct(val: any): string { if (val == null) return '0.00'; return Number(val).toFixed(4); }
  formatPct7(val: any): string { if (val == null) return '0.0000000'; return Number(val).toFixed(7); }
}