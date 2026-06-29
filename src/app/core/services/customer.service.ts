import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Customer {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  documentType: string;
  documentNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly API_URL = '/api/customers';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.API_URL, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.API_URL}/${id}`, { headers: this.getHeaders() });
  }

  create(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.API_URL, customer, { headers: this.getHeaders() });
  }

  update(id: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.API_URL}/${id}`, customer, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`, { headers: this.getHeaders() });
  }
}
