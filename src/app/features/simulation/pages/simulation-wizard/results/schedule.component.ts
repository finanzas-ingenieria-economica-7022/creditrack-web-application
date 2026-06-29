import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ScheduleItem {
  month: number;
  graceType: string;
  balloonInitialBalance: number;
  balloonInterest: number;
  balloonAmortization: number;
  balloonDesgravamen: number;
  balloonFinalBalance: number;
  regularInitialBalance: number;
  regularInterest: number;
  regularCuota: number;
  regularAmortization: number;
  regularDesgravamen: number;
  regularFinalBalance: number;
  riskInsurance: number;
  gps: number;
  portes: number;
  adminFee: number;
  netCashFlow: number;
}

@Component({
  selector: 'app-simulation-schedule',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      
      <!-- Header / Breadcrumbs -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="text-xs text-gray-500">
          <span>Simulaciones</span>
          <span class="mx-2">&gt;</span>
          <span class="text-white font-semibold">TRX-{{ getTrxId() }} — {{ getCustomerName() }}</span>
        </div>

        <div class="flex items-center space-x-3 shrink-0">
          <button (click)="exportPDF()" class="px-4 py-2 border border-dark-border hover:bg-gray-800 text-gray-300 font-semibold text-xs rounded-lg transition duration-150">
            Exportar PDF
          </button>
          <button (click)="exportExcel()" class="px-4 py-2 border border-dark-border hover:bg-gray-800 text-gray-300 font-semibold text-xs rounded-lg transition duration-150">
            Exportar Excel
          </button>
          <button (click)="onViewIndicators()" class="px-4 py-2 bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs rounded-lg flex items-center space-x-1.5 transition duration-150">
            <span>Ver indicadores</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>

      <!-- KPI metrics row -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <!-- MONTO FINANCIADO -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-5 space-y-1">
          <span class="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Monto Financiado</span>
          <div class="text-lg font-bold text-white">{{ formatCurrencySymbol() }} {{ formatNumber(simulation.loanAmount) }}</div>
        </div>

        <!-- CUOTA MENSUAL -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-5 space-y-1">
          <span class="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Cuota Mensual</span>
          <div class="text-lg font-bold text-white">{{ formatCurrencySymbol() }} {{ formatNumber(getFirstMonthRegularCuota()) }}</div>
        </div>

        <!-- CUOTA BALÓN -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-5 space-y-1 relative">
          <span class="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Cuota Balón</span>
          <div class="text-lg font-bold text-white">{{ formatCurrencySymbol() }} {{ formatNumber(getBalloonTotalAmount()) }}</div>
          <span class="absolute top-3 right-3 px-1.5 py-0.5 bg-yellow-950/30 border border-yellow-700/20 text-accent-gold text-[8px] font-bold rounded">
            MES {{ simulation.termMonths }}
          </span>
        </div>

        <!-- VAN DEUDOR -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-5 space-y-1">
          <span class="text-[9px] font-bold text-gray-500 uppercase tracking-wider flex items-center">
            <span>Van Deudor</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-gray-500 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <div class="text-lg font-bold text-white">{{ formatCurrencySymbol() }} {{ formatNumber(simulation.van) }}</div>
        </div>

        <!-- TIR MENSUAL -->
        <div class="bg-dark-card border border-dark-border rounded-xl p-5 space-y-1">
          <span class="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Tir Mensual</span>
          <div class="text-lg font-bold text-accent-gold">{{ formatPercentage(simulation.tir) }}%</div>
        </div>
      </div>

      <!-- Schedule Table -->
      <div class="bg-dark-card border border-dark-border rounded-xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr class="border-b border-dark-border text-gray-500 text-[10px] uppercase font-bold tracking-wider">
                <th class="px-4 py-4 text-center">N°</th>
                <th class="px-4 py-4">Fecha</th>
                <th class="px-4 py-4">Saldo Inicial</th>
                <th class="px-4 py-4">Interés</th>
                <th class="px-4 py-4">Desgravamen</th>
                <th class="px-4 py-4">Seg. Vehicular</th>
                <th class="px-4 py-4">Portes</th>
                <th class="px-4 py-4">Amortización</th>
                <th class="px-4 py-4">Cuota</th>
                <th class="px-4 py-4">Saldo Final</th>
                <th class="px-4 py-4 text-right">Tipo</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-dark-border text-xs text-gray-300">
              <tr
                *ngFor="let item of schedule"
                class="hover:bg-gray-800/10 transition duration-100"
                [ngClass]="isBalloonRow(item) ? 'bg-yellow-950/5 text-accent-gold font-semibold' : ''"
              >
                <td class="px-4 py-3.5 text-center font-bold" [ngClass]="isBalloonRow(item) ? 'text-accent-gold' : 'text-gray-500'">
                  {{ item.month }}
                </td>
                <td class="px-4 py-3.5">{{ getPaymentDate(item.month) }}</td>
                
                <!-- Initial Balance -->
                <td class="px-4 py-3.5">
                  {{ formatCurrencySymbol() }} {{ formatNumber(isBalloonRow(item) ? item.balloonInitialBalance : item.regularInitialBalance) }}
                </td>
                
                <!-- Interest -->
                <td class="px-4 py-3.5 text-yellow-600/90 font-medium">
                  {{ formatCurrencySymbol() }} {{ formatNumber(isBalloonRow(item) ? item.balloonInterest : item.regularInterest) }}
                </td>
                
                <!-- Desgravamen -->
                <td class="px-4 py-3.5">
                  {{ formatCurrencySymbol() }} {{ formatNumber(isBalloonRow(item) ? item.balloonDesgravamen : item.regularDesgravamen) }}
                </td>
                
                <!-- Seg Vehicular -->
                <td class="px-4 py-3.5">
                  {{ formatCurrencySymbol() }} {{ formatNumber(item.riskInsurance) }}
                </td>
                
                <!-- Portes -->
                <td class="px-4 py-3.5">
                  {{ formatCurrencySymbol() }} {{ formatNumber(item.portes) }}
                </td>
                
                <!-- Amortización -->
                <td class="px-4 py-3.5">
                  {{ formatCurrencySymbol() }} {{ formatNumber(isBalloonRow(item) ? item.balloonInitialBalance : item.regularAmortization) }}
                </td>
                
                <!-- Cuota (Amortizacion + Interes + Desgravamen + SegVehicular + Portes) -->
                <td class="px-4 py-3.5 font-bold" [ngClass]="isBalloonRow(item) ? 'text-accent-gold' : 'text-white'">
                  {{ formatCurrencySymbol() }} {{ formatNumber(calculateRowCuota(item)) }}
                </td>
                
                <!-- Saldo Final -->
                <td class="px-4 py-3.5">
                  {{ formatCurrencySymbol() }} {{ formatNumber(isBalloonRow(item) ? 0.00 : item.regularFinalBalance) }}
                </td>
                
                <!-- Tipo -->
                <td class="px-4 py-3.5 text-right">
                  <span
                    class="inline-block px-2 py-0.5 rounded text-[8px] font-bold tracking-wider"
                    [ngClass]="isBalloonRow(item) ? 'bg-accent-gold/20 text-accent-gold border border-accent-gold/30' : 'bg-gray-800 text-gray-500'"
                  >
                    {{ isBalloonRow(item) ? 'BALÓN' : 'BASE' }}
                  </span>
                </td>
              </tr>
              
              <!-- Totals row -->
              <tr class="bg-dark-input/20 font-bold border-t border-dark-border text-white text-xs select-none">
                <td colspan="3" class="px-4 py-4 text-right uppercase tracking-wider">Totales</td>
                <td class="px-4 py-4 text-yellow-600/90">{{ formatCurrencySymbol() }} {{ formatNumber(totals.interest) }}</td>
                <td class="px-4 py-4">{{ formatCurrencySymbol() }} {{ formatNumber(totals.desgravamen) }}</td>
                <td class="px-4 py-4">{{ formatCurrencySymbol() }} {{ formatNumber(totals.insurance) }}</td>
                <td class="px-4 py-4">{{ formatCurrencySymbol() }} {{ formatNumber(totals.portes) }}</td>
                <td class="px-4 py-4">{{ formatCurrencySymbol() }} {{ formatNumber(totals.amortization) }}</td>
                <td class="px-4 py-4 text-brand-text">{{ formatCurrencySymbol() }} {{ formatNumber(totals.cuota) }}</td>
                <td colspan="2" class="px-4 py-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Start new simulation button -->
      <div class="flex justify-start">
        <button
          type="button"
          (click)="onNewSimulation()"
          class="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 border border-dark-border text-gray-300 font-semibold text-xs rounded-lg transition duration-150"
        >
          Nueva Simulación
        </button>
      </div>

    </div>
  `
})
export class SimulationScheduleComponent {
  @Input() result!: { simulation: any; schedule: ScheduleItem[] };
  @Input() customerName = '';
  @Output() viewIndicators = new EventEmitter<void>();
  @Output() newSimulation = new EventEmitter<void>();

  get simulation() {
    return this.result.simulation;
  }

  get schedule() {
    return this.result.schedule;
  }

  getTrxId(): string {
    if (!this.simulation.id) return '0091';
    return String(this.simulation.id).padStart(4, '0');
  }

  getCustomerName(): string {
    return this.customerName || 'Cliente';
  }

  getFirstMonthRegularCuota(): number {
    if (this.schedule.length > 0) {
      return this.calculateRowCuota(this.schedule[0]);
    }
    return 0;
  }

  getBalloonTotalAmount(): number {
    // Find the balloon row (which is the last item)
    if (this.schedule.length > 0) {
      const last = this.schedule[this.schedule.length - 1];
      return last.balloonInitialBalance;
    }
    return 0;
  }

  isBalloonRow(item: ScheduleItem): boolean {
    return item.month === this.simulation.termMonths && item.balloonInitialBalance > 0;
  }

  calculateRowCuota(item: ScheduleItem): number {
    const isBal = this.isBalloonRow(item);
    const interest = isBal ? item.balloonInterest : item.regularInterest;
    const desgravamen = isBal ? item.balloonDesgravamen : item.regularDesgravamen;
    const amort = isBal ? item.balloonInitialBalance : item.regularAmortization;
    return interest + desgravamen + item.riskInsurance + item.portes + amort;
  }

  getPaymentDate(monthIndex: number): string {
    const d = new Date();
    // Use created date if available
    if (this.simulation.createdDate) {
      const parsedDate = new Date(this.simulation.createdDate);
      if (!isNaN(parsedDate.getTime())) {
        d.setTime(parsedDate.getTime());
      }
    }
    d.setMonth(d.getMonth() + monthIndex);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }

  // Totals calculations
  get totals() {
    let interest = 0;
    let desgravamen = 0;
    let insurance = 0;
    let portes = 0;
    let amortization = 0;
    let cuota = 0;

    this.schedule.forEach(item => {
      const isBal = this.isBalloonRow(item);
      interest += isBal ? item.balloonInterest : item.regularInterest;
      desgravamen += isBal ? item.balloonDesgravamen : item.regularDesgravamen;
      insurance += item.riskInsurance;
      portes += item.portes;
      amortization += isBal ? item.balloonInitialBalance : item.regularAmortization;
      cuota += this.calculateRowCuota(item);
    });

    return { interest, desgravamen, insurance, portes, amortization, cuota };
  }

  onViewIndicators() {
    this.viewIndicators.emit();
  }

  onNewSimulation() {
    this.newSimulation.emit();
  }

  exportPDF() {
    window.print();
  }

  exportExcel() {
    const sim = this.simulation;
    const trxId = this.getTrxId();
    const customerName = this.getCustomerName();
    const isSoles = sim.vehiclePrice > 35000;
    const currencySymbol = isSoles ? 'S/' : 'USD';

    // Import ExcelJS dynamically to maintain tiny initial bundle size
    import('exceljs').then((ExcelJSModule: any) => {
      const ExcelJS = ExcelJSModule.default || ExcelJSModule;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(`Simulación TRX-${trxId}`);

      worksheet.columns = [
        { header: 'N°', key: 'month', width: 6 },
        { header: 'Fecha', key: 'date', width: 12 },
        { header: 'Saldo Inicial', key: 'initial', width: 15 },
        { header: 'Interés', key: 'interest', width: 15 },
        { header: 'Desgravamen', key: 'desgravamen', width: 15 },
        { header: 'Seg. Vehicular', key: 'insurance', width: 15 },
        { header: 'Portes', key: 'portes', width: 12 },
        { header: 'Amortización', key: 'amortization', width: 15 },
        { header: 'Cuota', key: 'cuota', width: 15 },
        { header: 'Saldo Final', key: 'final', width: 15 },
        { header: 'Tipo', key: 'type', width: 10 }
      ];

      // Banner Title
      worksheet.mergeCells('A1:K1');
      const titleCell = worksheet.getCell('A1');
      titleCell.value = 'REPORTE DE SIMULACIÓN FINANCIERA — CREDISTRACK';
      titleCell.font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
      worksheet.getRow(1).height = 30;

      // Spacing
      worksheet.addRow([]);

      // Section titles
      worksheet.mergeCells('A3:D3');
      const sec1Cell = worksheet.getCell('A3');
      sec1Cell.value = 'DATOS DEL CRÉDITO';
      sec1Cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF1E3A8A' } };
      sec1Cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFF6FF' } };

      worksheet.mergeCells('F3:H3');
      const sec2Cell = worksheet.getCell('F3');
      sec2Cell.value = 'PARÁMETROS FINANCIEROS Y CARGOS';
      sec2Cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF1E3A8A' } };
      sec2Cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFF6FF' } };

      worksheet.mergeCells('J3:K3');
      const sec3Cell = worksheet.getCell('J3');
      sec3Cell.value = 'INDICADORES CLAVE';
      sec3Cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF1E3A8A' } };
      sec3Cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFF6FF' } };

      const setMeta = (rowIdx: number, colLabel: string, label: string, colVal: string, value: any, numFormat?: string) => {
        const labelCell = worksheet.getCell(`${colLabel}${rowIdx}`);
        labelCell.value = label;
        labelCell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: 'FF4B5563' } };

        const valCell = worksheet.getCell(`${colVal}${rowIdx}`);
        valCell.value = value;
        valCell.font = { name: 'Segoe UI', size: 9, color: { argb: 'FF111827' } };
        if (numFormat) {
          valCell.numFormat = numFormat;
        }
      };

      // Row 4
      setMeta(4, 'A', 'Cliente:', 'B', customerName);
      setMeta(4, 'F', 'Tasa Base Anual:', 'G', `${sim.interestRateType} ${(sim.interestRate * 100).toFixed(2)}%`);
      setMeta(4, 'J', 'VAN Deudor:', 'K', sim.van, `$#,##0.00;($#,##0.00);"-"`);

      // Row 5
      const carName = sim.name.replace('Simulación ', '');
      setMeta(5, 'A', 'Vehículo:', 'B', carName);
      setMeta(5, 'F', 'Tasa Periodo (TEM):', 'G', sim.tem, '0.0000%');
      setMeta(5, 'J', 'TIR de Operación:', 'K', sim.tir, '0.00%');

      // Row 6
      setMeta(6, 'A', 'Precio:', 'B', sim.vehiclePrice, `$#,##0.00`);
      const graceText = sim.gracePeriods && sim.gracePeriods.includes('P') ? 'Parcial' : sim.gracePeriods && sim.gracePeriods.includes('T') ? 'Total' : 'Sin gracia';
      setMeta(6, 'F', 'Período Gracia:', 'G', graceText);
      setMeta(6, 'J', 'TCEA Proyectada:', 'K', sim.tcea, '0.00%');

      // Row 7
      setMeta(7, 'A', 'Cuota Inicial:', 'B', sim.vehiclePrice * sim.initialPaymentPercentage, `$#,##0.00`);
      setMeta(7, 'F', 'Seg. Desgravamen:', 'G', sim.desgravamenRate, '0.000%');
      setMeta(7, 'J', 'Moneda:', 'K', currencySymbol);

      // Row 8
      setMeta(8, 'A', 'Monto Préstamo:', 'B', sim.loanAmount, `$#,##0.00`);
      setMeta(8, 'F', 'Seguro Vehicular:', 'G', sim.riskInsuranceRate * sim.vehiclePrice / 12, `$#,##0.00`);
      setMeta(8, 'J', 'Plazo (Meses):', 'K', sim.termMonths);

      // Row 9
      setMeta(9, 'A', 'Cuota Balón:', 'B', sim.loanAmount * sim.finalPaymentPercentage, `$#,##0.00`);
      setMeta(9, 'F', 'Portes:', 'G', sim.portesFee, `$#,##0.00`);

      worksheet.addRow([]);
      worksheet.addRow([]);

      // Headers row (Row 12)
      const headerRow = worksheet.addRow([
        'N°', 'Fecha', 'Saldo Inicial', 'Interés', 'Desgravamen', 
        'Seg. Vehicular', 'Portes', 'Amortización', 'Cuota', 'Saldo Final', 'Tipo'
      ]);
      headerRow.height = 25;
      headerRow.eachCell((cell: any) => {
        cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });

      let totalInterest = 0;
      let totalDesgravamen = 0;
      let totalInsurance = 0;
      let totalPortes = 0;
      let totalAmortization = 0;
      let totalCuota = 0;

      this.schedule.forEach(item => {
        const isBal = this.isBalloonRow(item);
        const initial = isBal ? item.balloonInitialBalance : item.regularInitialBalance;
        const interest = isBal ? item.balloonInterest : item.regularInterest;
        const desgravamen = isBal ? item.balloonDesgravamen : item.regularDesgravamen;
        const insurance = item.riskInsurance;
        const portes = item.portes;
        const amortization = isBal ? item.balloonInitialBalance : item.regularAmortization;
        const final = isBal ? 0.00 : item.regularFinalBalance;
        
        const cuota = interest + desgravamen + insurance + portes + amortization;
        const dateStr = this.getPaymentDate(item.month);

        totalInterest += interest;
        totalDesgravamen += desgravamen;
        totalInsurance += insurance;
        totalPortes += portes;
        totalAmortization += amortization;
        totalCuota += cuota;

        const row = worksheet.addRow([
          item.month,
          dateStr,
          initial,
          interest,
          desgravamen,
          insurance,
          portes,
          amortization,
          cuota,
          final,
          isBal ? 'BALON' : 'BASE'
        ]);

        row.height = 20;

        row.eachCell((cell: any, colNumber: number) => {
          cell.alignment = { vertical: 'middle' };
          cell.border = { bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } } };

          if (colNumber >= 3 && colNumber <= 10) {
            cell.numFormat = `#,##0.00`;
            cell.alignment = { horizontal: 'right', vertical: 'middle' };
          }

          if (isBal) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
            cell.font = { name: 'Segoe UI', color: { argb: 'FFB45309' }, bold: true };
            cell.border = { bottom: { style: 'thin', color: { argb: 'FFFDE68A' } } };
          }
        });
      });

      // Add Totals row
      const totalsRow = worksheet.addRow([
        'TOTALES', '', '', totalInterest, totalDesgravamen, 
        totalInsurance, totalPortes, totalAmortization, totalCuota, '', ''
      ]);
      worksheet.mergeCells(`A${totalsRow.number}:C${totalsRow.number}`);
      totalsRow.height = 22;
      totalsRow.eachCell((cell: any, colNumber: number) => {
        cell.font = { name: 'Segoe UI', bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF334155' } };
        cell.alignment = { vertical: 'middle' };
        if (colNumber >= 4 && colNumber <= 9) {
          cell.numFormat = `#,##0.00`;
          cell.alignment = { horizontal: 'right', vertical: 'middle' };
        }
      });

      workbook.xlsx.writeBuffer().then((buffer: any) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Cronograma_TRX-${trxId}_${customerName.replace(/\s+/g, '_')}.xlsx`;
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }).catch(err => {
      console.error('Failed to export Excel', err);
      alert('Error al exportar a Excel.');
    });
  }

  formatCurrencySymbol(): string {
    // Soles or dollars based on simulation params
    // Let's decide based on price thresholds or fallback to soles
    return this.simulation.vehiclePrice <= 35000 ? 'USD' : 'S/';
  }

  formatNumber(val: number): string {
    return new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
  }

  formatPercentage(val: number): string {
    return (val * 100).toFixed(2);
  }
}
