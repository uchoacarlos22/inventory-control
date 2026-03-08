import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthDataService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  login(credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/auth/login`, credentials);
  }
}
