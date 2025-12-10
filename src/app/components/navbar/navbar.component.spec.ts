import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from './navbar.component';

class AuthServiceMock {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userProfileSubject = new BehaviorSubject<{ name?: string; email?: string } | null>(null);

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  userProfile$ = this.userProfileSubject.asObservable();

  isLoggedIn = jasmine.createSpy('isLoggedIn').and.returnValue(false);
  loginWithCognito = jasmine.createSpy('loginWithCognito');
  registerWithCognito = jasmine.createSpy('registerWithCognito');
  logout = jasmine.createSpy('logout');
  handleRedirectCallback = jasmine.createSpy('handleRedirectCallback');

  emitAuthState(state: boolean) {
    this.isAuthenticatedSubject.next(state);
  }

  emitProfile(profile: { name?: string; email?: string }) {
    this.userProfileSubject.next(profile);
  }
}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceMock: AuthServiceMock;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceMock = new AuthServiceMock();
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerSpy },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger loginWithCognito when openLoginModal is called', () => {
    component.openLoginModal();
    expect(authServiceMock.loginWithCognito).toHaveBeenCalledTimes(1);
  });

  it('should trigger registerWithCognito when openRegisterModal is called', () => {
    component.openRegisterModal();
    expect(authServiceMock.registerWithCognito).toHaveBeenCalledTimes(1);
  });

  it('should logout and navigate to /logout', () => {
    component.logout();
    expect(authServiceMock.logout).toHaveBeenCalledTimes(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/logout']);
  });

  it('should navigate to profile when goToProfile is called', () => {
    component.goToProfile();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/mi-perfil']);
  });
});
