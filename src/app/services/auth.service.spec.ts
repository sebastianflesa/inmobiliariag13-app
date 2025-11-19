import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debería realizar login', () => {
    const credentials = { email: 'user@example.com', password: 'password' };
    const token = 'token-de-prueba';
    service.login(credentials.email, credentials.password).subscribe(response => {
      expect(response).toEqual({ token });
    });
    const req = httpMock.expectOne('http://localhost:8000/api/login');
    expect(req.request.method).toBe('POST');
    req.flush({ token });
  });

  it('debería realizar logout', () => {
    service.setToken('token-de-prueba');
    service.logout();
    expect(service.getToken()).toBeNull();
  });

  it('debería obtener token', () => {
    service.setToken('token-de-prueba');
    expect(service.getToken()).toBe('token-de-prueba');
  });

  it('debería establecer token', () => {
    service.setToken('token-de-prueba');
    expect(service.getToken()).toBe('token-de-prueba');
  });

  it('debería verificar si está logueado', () => {
    service.setToken('token-de-prueba');
    expect(service.isLoggedIn()).toBeTruthy();
    service.logout();
    expect(service.isLoggedIn()).toBeFalsy();
  });

  it('debería realizar registro', () => {
    const user = { nombre: 'Juan', apellido: 'Pérez', email: 'juan@example.com', password: 'password' };
    service.register(user).subscribe((response: typeof user) => {
      expect(response).toEqual(user);
    });
    const req = httpMock.expectOne('http://localhost:8000/api/register');
    expect(req.request.method).toBe('POST');
    req.flush(user);
  });
});