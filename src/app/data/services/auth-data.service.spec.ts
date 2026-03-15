import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthDataService } from './auth-data.service';

describe('AuthDataService', () => {
  let service: AuthDataService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthDataService,
      ],
    });

    service = TestBed.inject(AuthDataService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST to /auth/login with credentials', () => {
    const mockCredentials = { username: 'mor_2314', password: '83r5^_' };
    const mockResponse = { token: 'fake-jwt-token-123' };

    service.login(mockCredentials).subscribe((res) => {
      expect(res.token).toBe('fake-jwt-token-123');
    });

    const req = httpTesting.expectOne((r) => r.url.includes('/auth/login'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCredentials);
    req.flush(mockResponse);
  });
});
