import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AuthFacadeService } from './auth-facade.service';
import { AuthDataService } from '../data/services/auth-data.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('AuthFacadeService', () => {
  let service: AuthFacadeService;
  let authDataMock: { login: jest.Mock };
  let routerMock: { navigate: jest.Mock };

  beforeEach(() => {
    localStorage.clear();

    authDataMock = { login: jest.fn() };
    routerMock = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        AuthFacadeService,
        { provide: AuthDataService, useValue: authDataMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    service = TestBed.inject(AuthFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should NOT be authenticated initially (no token)', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should set loading to true while login is in progress', () => {
    authDataMock.login.mockReturnValue(of({ token: 'abc123' }));
    expect(service.loading()).toBe(false);
  });

  it('should authenticate on successful login', fakeAsync(() => {
    const mockToken = 'fake-jwt-token-success';
    authDataMock.login.mockReturnValue(of({ token: mockToken }));

    service.login({ username: 'test', password: 'test' });
    tick();

    expect(service.isAuthenticated()).toBe(true);
    expect(service.token()).toBe(mockToken);
    expect(localStorage.getItem('token')).toBe(mockToken);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(service.loading()).toBe(false);
  }));

  it('should set error on failed login', fakeAsync(() => {
    authDataMock.login.mockReturnValue(throwError(() => new Error('Unauthorized')));

    service.login({ username: 'wrong', password: 'wrong' });
    tick();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.error()).toBe('Invalid username or password');
    expect(service.loading()).toBe(false);
  }));

  it('should clear token and redirect on logout', fakeAsync(() => {
    // First: simulate a login
    authDataMock.login.mockReturnValue(of({ token: 'token-to-clear' }));
    service.login({ username: 'test', password: 'test' });
    tick();
    expect(service.isAuthenticated()).toBe(true);

    // Then: logout
    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.token()).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  }));
});
