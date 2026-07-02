import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ProfileResponse, ProfileUpdateRequest } from '../models/iam.models';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly API_URL = '/api/profiles';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  findMyProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.API_URL}/me`, { headers: this.authService.buildAuthHeaders() });
  }

  updateMyProfile(request: ProfileUpdateRequest): Observable<ProfileResponse> {
    return this.http.put<ProfileResponse>(`${this.API_URL}/me`, request, { headers: this.authService.buildAuthHeaders() });
  }
}
