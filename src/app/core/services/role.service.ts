import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { RoleResponse } from '../models/iam.models';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly API_URL = '/api/roles';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  findAll(): Observable<RoleResponse[]> {
    return this.http.get<RoleResponse[]>(this.API_URL, { headers: this.authService.buildAuthHeaders() });
  }

  findAllPermissions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/permissions`, { headers: this.authService.buildAuthHeaders() });
  }
}
