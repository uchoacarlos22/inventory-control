import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, HttpRequest } from '@angular/common/http';
import { AuthFacadeService } from '../../state/auth-facade.service';
import { jwtInterceptor } from './jwt.interceptor';
import { HttpClient, withInterceptors } from '@angular/common/http';

describe('jwtInterceptor', () => {
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;
  let authFacadeMock: { token: jest.Mock };

  beforeEach(() => {
    authFacadeMock = { token: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([jwtInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthFacadeService, useValue: authFacadeMock },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should add Authorization header when token exists', () => {
    authFacadeMock.token.mockReturnValue('fake-jwt-token');

    httpClient.get('/api/test').subscribe();

    const req = httpTesting.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-jwt-token');
    req.flush({});
  });

  it('should NOT add Authorization header when token is null', () => {
    authFacadeMock.token.mockReturnValue(null);

    httpClient.get('/api/test').subscribe();

    const req = httpTesting.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
