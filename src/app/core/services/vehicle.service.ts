import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Vehicle {
  id?: number;
  brand: string;
  model: string;
  price: number;
  imageUrl?: string;
  year: number;
}

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private readonly API_URL = '/api/vehicles';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAll(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.API_URL, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.API_URL}/${id}`, { headers: this.getHeaders() });
  }

  create(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.API_URL, vehicle, { headers: this.getHeaders() });
  }

  update(id: number, vehicle: Vehicle): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.API_URL}/${id}`, vehicle, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`, { headers: this.getHeaders() });
  }
}
