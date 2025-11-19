import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { RegisterModalComponent } from './register-modal.component';

describe('RegisterModalComponent', () => {
  let component: RegisterModalComponent;
  let fixture: ComponentFixture<RegisterModalComponent>;
  let activeModalSpy: any;

  beforeEach(async () => {
    activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close']);

    await TestBed.configureTestingModule({
      imports: [RegisterModalComponent, NgbModalModule, HttpClientTestingModule],
      providers: [
        { provide: NgbActiveModal, useValue: activeModalSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener un formulario inválido cuando está vacío', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('debería tener un formulario válido cuando se llenan todos los campos correctamente', () => {
    component.registerForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });
    expect(component.registerForm.valid).toBeTruthy();
  });

  it('debería mostrar un mensaje de error cuando las contraseñas no coinciden', () => {
    spyOn(window, 'alert');
    component.registerForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password456'
    });
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('Las contraseñas no coinciden');
  });

  it('debería cerrar el modal después de un registro exitoso', () => {
    const authService = TestBed.inject(AuthService);
    spyOn(authService, 'register').and.returnValue(of({}));
    component.registerForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });
    component.onSubmit();
    expect(activeModalSpy.close).toHaveBeenCalledTimes(1);
  });
});