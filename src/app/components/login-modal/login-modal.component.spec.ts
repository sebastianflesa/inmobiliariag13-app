import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Subject } from 'rxjs';
import { LoginComponent } from './login-modal.component';

class OidcSecurityServiceMock {
  isAuthenticated$ = new Subject<{ isAuthenticated: boolean }>();
  userData$ = new Subject<any>();
  authorize = jasmine.createSpy('authorize');
  logoff = jasmine.createSpy('logoff');
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let activeModalSpy: jasmine.SpyObj<NgbActiveModal>;
  let routerSpy: jasmine.SpyObj<Router>;
  let oidcMock: OidcSecurityServiceMock;

  beforeEach(async () => {
    activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    oidcMock = new OidcSecurityServiceMock();

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: NgbActiveModal, useValue: activeModalSpy },
        { provide: Router, useValue: routerSpy },
        { provide: OidcSecurityService, useValue: oidcMock },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger authorize when login is called', () => {
    component.login();
    expect(oidcMock.authorize).toHaveBeenCalledTimes(1);
  });

  it('should trigger logoff when logout is called', () => {
    component.logout();
    expect(oidcMock.logoff).toHaveBeenCalledTimes(1);
  });

  it('should close modal when closeModal is called', () => {
    component.closeModal();
    expect(activeModalSpy.close).toHaveBeenCalledTimes(1);
  });
});
