import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { CreateUserRequest, UpdateUserRequest, UserResponse } from '../models/iam.models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = '/api/users';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  findAll(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.API_URL, { headers: this.authService.buildAuthHeaders() });
  }

  findById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API_URL}/${id}`, { headers: this.authService.buildAuthHeaders() });
  }

  findMe(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API_URL}/me`, { headers: this.authService.buildAuthHeaders() });
  }

  create(request: CreateUserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(this.API_URL, request, { headers: this.authService.buildAuthHeaders() });
  }

  update(id: number, request: UpdateUserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.API_URL}/${id}`, request, { headers: this.authService.buildAuthHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`, { headers: this.authService.buildAuthHeaders() });
  }
}
