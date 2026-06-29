import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

export interface DashboardMetrics {
  id: number;
  totalSimulations: number;
  averageLoanAmount: number;
  averageTcea: number;
  maxTcea: number;
  minTcea: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly ANALYTICS_URL = '/api/analytics';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getDashboardMetrics(): Observable<DashboardMetrics> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<DashboardMetrics>(`${this.ANALYTICS_URL}/dashboard`, { headers });
  }
}
