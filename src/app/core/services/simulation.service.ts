import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface SimulationRequestPayload {
  name: string;
  vehiclePrice: number;
  initialPaymentPercentage: number;
  finalPaymentPercentage: number;
  termMonths: number;
  interestRate: number;
  interestRateType: string;
  capitalizationType: string;
  paymentFrequency: number;
  daysPerYear: number;
  notaryCost: number;
  registrationCost: number;
  appraisalCost: number;
  studyCommission: number;
  activationCommission: number;
  gpsFee: number;
  portesFee: number;
  adminFee: number;
  desgravamenRate: number;
  riskInsuranceRate: number;
  cokRate: number;
  customerId: number;
  vehicleId: number;
  financialEntityId: number;
  gracePeriods: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  private readonly API_URL = '/api/simulations';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  create(request: SimulationRequestPayload): Observable<any> {
    return this.http.post<any>(this.API_URL, request, { headers: this.getHeaders() });
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`, { headers: this.getHeaders() });
  }
}
