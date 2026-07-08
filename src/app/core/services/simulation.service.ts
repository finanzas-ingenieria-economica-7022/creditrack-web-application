import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface SimulationRequestPayload {
  clientId: number;
  vehicleId: number;
  financialEntityId: number;
  vehiclePrice: number;
  currency: string;
  teaPercent: number;
  downPaymentPercent: number;
  termMonths: number;
  cokTeaPercent: number;
  firstPaymentDate: string;
  paymentDay: number;
  graceType: 'NONE' | 'PARTIAL' | 'TOTAL';
  graceMonths: number;
  balloonPercent: number;
  creditLifeInsuranceEnabled: boolean;
  creditLifeInsuranceMonthlyPercent: number;
  vehicleInsuranceEnabled: boolean;
  vehicleInsuranceAnnualPercent: number;
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

  getAll(page = 0, size = 20): Observable<any> {
    return this.http.get<any>(`${this.API_URL}?page=${page}&size=${size}`, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`, { headers: this.getHeaders() });
  }
}
