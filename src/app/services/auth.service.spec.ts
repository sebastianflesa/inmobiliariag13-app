import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { of, Subject } from 'rxjs';
import { AuthService } from './auth.service';

class OidcSecurityServiceMock {
  isAuthenticated$ = new Subject<{ isAuthenticated: boolean }>();
  userData$ = new Subject<any>();

  checkAuth = jasmine.createSpy('checkAuth').and.returnValue(of({ isAuthenticated: false, accessToken: null, userData: null }));
  getAccessToken = jasmine.createSpy('getAccessToken').and.returnValue(of(null));
  authorize = jasmine.createSpy('authorize');
  logoff = jasmine.createSpy('logoff');
}

describe('AuthService', () => {
  let service: AuthService;
  let oidcMock: OidcSecurityServiceMock;

  beforeEach(() => {
    oidcMock = new OidcSecurityServiceMock();

    TestBed.configureTestingModule({
      providers: [
        { provide: OidcSecurityService, useValue: oidcMock },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set token and mark session as authenticated', (done) => {
    service.setToken('token-de-prueba');
    expect(service.isLoggedIn()).toBeTrue();
    service.getToken().subscribe(token => {
      expect(token).toBe('token-de-prueba');
      done();
    });
  });

  it('should call authorize when loginWithCognito is executed', () => {
    service.loginWithCognito();
    expect(oidcMock.authorize).toHaveBeenCalled();
  });

  it('should call logoff when logout is executed', () => {
    service.logout();
    expect(oidcMock.logoff).toHaveBeenCalled();
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should trigger checkAuth when ensureAuthenticated is invoked', (done) => {
    service.ensureAuthenticated().subscribe(() => {
      expect(oidcMock.checkAuth).toHaveBeenCalled();
      done();
    });
  });
});
