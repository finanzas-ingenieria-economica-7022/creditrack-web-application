import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface FinancialEntity {
  id?: number;
  name: string;
  standardTea: number;
  logoUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FinancialEntityService {
  private readonly API_URL = '/api/financial-entities';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAll(): Observable<FinancialEntity[]> {
    return this.http.get<FinancialEntity[]>(this.API_URL, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<FinancialEntity> {
    return this.http.get<FinancialEntity>(`${this.API_URL}/${id}`, { headers: this.getHeaders() });
  }

  create(entity: FinancialEntity): Observable<FinancialEntity> {
    return this.http.post<FinancialEntity>(this.API_URL, entity, { headers: this.getHeaders() });
  }
}
