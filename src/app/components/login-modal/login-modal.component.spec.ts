import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ClienteService } from '../../services/cliente.service';

import { LoginComponent } from './login-modal.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let authServiceSpy: any;
  let clienteServiceSpy: any;
  let activeModalSpy: any;
  let routerSpy: any;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'setToken']);
    authServiceSpy.login.and.returnValue(of({ token: 'token' }));
    clienteServiceSpy = jasmine.createSpyObj('ClienteService', ['setToken']);
    activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ClienteService, useValue: clienteServiceSpy },
        { provide: NgbActiveModal, useValue: activeModalSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })

    component = new LoginComponent(authServiceSpy, clienteServiceSpy, activeModalSpy, routerSpy);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener un formulario inválido cuando está vacío', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('debería tener un formulario válido cuando se llenan todos los campos correctamente', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password'
    });
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('debería llamar a login del AuthService cuando se envía el formulario', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password'
    });
    component.onSubmit();
    expect(authServiceSpy.login).toHaveBeenCalledTimes(1);
    expect(authServiceSpy.login).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('debería cerrar el modal después de un inicio de sesión exitoso', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password'
    });
    component.onSubmit();
    expect(activeModalSpy.close).toHaveBeenCalledTimes(1);
  });

  it('debería navegar a la página principal después de un inicio de sesión exitoso', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password'
    });
    component.onSubmit();
    expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
});