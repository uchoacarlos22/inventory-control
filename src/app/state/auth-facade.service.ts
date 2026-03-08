import { Injectable, inject, signal, computed } from '@angular/core';
import { AuthDataService } from '../data/services/auth-data.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthFacadeService {
  private dataService = inject(AuthDataService);
  private router = inject(Router);

  // Signals
  private _token = signal<string | null>(localStorage.getItem('token'));
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Computeds
  isAuthenticated = computed(() => !!this._token());
  token = computed(() => this._token());
  loading = computed(() => this._loading());
  error = computed(() => this._error());

  login(credentials: any): void {
    this._loading.set(true);
    this._error.set(null);

    this.dataService.login(credentials).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this._token.set(res.token);
        this._loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this._error.set('Invalid username or password');
        this._loading.set(false);
      }
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this._token.set(null);
    this.router.navigate(['/login']);
  }
}
