import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthFacadeService } from '../../state/auth-facade.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let authFacadeMock: { isAuthenticated: jest.Mock };
  let routerMock: { navigate: jest.Mock };

  beforeEach(() => {
    authFacadeMock = { isAuthenticated: jest.fn() };
    routerMock = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthFacadeService, useValue: authFacadeMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  it('should allow access when user is authenticated', () => {
    authFacadeMock.isAuthenticated.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/dashboard' } as any)
    );

    expect(result).toBe(true);
  });

  it('should deny access and redirect to /login when not authenticated', () => {
    authFacadeMock.isAuthenticated.mockReturnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/dashboard' } as any)
    );

    expect(result).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/dashboard' },
    });
  });

  it('should pass the current URL as returnUrl query param', () => {
    authFacadeMock.isAuthenticated.mockReturnValue(false);

    TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/products' } as any)
    );

    expect(routerMock.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/products' },
    });
  });
});
