import { TestBed } from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from '../login-modal/login-modal.component';
import { RegisterModalComponent } from '../register-modal/register-modal.component';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let authServiceSpy: any;
  let modalServiceSpy: any;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'logout']);
    modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NgbModal, useValue: modalServiceSpy }
      ]
    })
      .compileComponents();

    component = new NavbarComponent(authServiceSpy, modalServiceSpy);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar a isLoggedIn del AuthService', () => {
    component.isLoggedIn();
    expect(authServiceSpy.isLoggedIn).toHaveBeenCalledTimes(1);
  });

  it('debería abrir el modal de login', () => {
    component.openLoginModal();
    expect(modalServiceSpy.open).toHaveBeenCalledTimes(1);
    expect(modalServiceSpy.open).toHaveBeenCalledWith(LoginComponent);
  });

  it('debería abrir el modal de registro', () => {
    component.openRegisterModal();
    expect(modalServiceSpy.open).toHaveBeenCalledTimes(1);
    expect(modalServiceSpy.open).toHaveBeenCalledWith(RegisterModalComponent);
  });

  it('debería llamar a logout del AuthService', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalledTimes(1);
  });
});