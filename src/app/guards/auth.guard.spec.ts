import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let authServiceMock: any;
  let routerMock: any;

  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  beforeEach(() => {
    authServiceMock = {
      ensureAuthenticated: jasmine.createSpy()
    };

    routerMock = {
      createUrlTree: jasmine.createSpy().and.returnValue({} as UrlTree)
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    route = {} as ActivatedRouteSnapshot;
    state = { url: '/test' } as RouterStateSnapshot;
  });

  it('should block access and build UrlTree when user is not authenticated', (done) => {
    authServiceMock.ensureAuthenticated.and.returnValue(of(false));

    TestBed.runInInjectionContext(() =>
      authGuard(route, state)
    ).subscribe(result => {
      expect(result).toBe(routerMock.createUrlTree.calls.mostRecent().returnValue);
      expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/unauthorized']);
      done();
    });
  });

  it('should allow access when user is authenticated', (done) => {
    authServiceMock.ensureAuthenticated.and.returnValue(of(true));

    TestBed.runInInjectionContext(() =>
      authGuard(route, state)
    ).subscribe(result => {
      expect(result).toBeTrue();
      expect(routerMock.createUrlTree).not.toHaveBeenCalled();
      done();
    });
  });
});
