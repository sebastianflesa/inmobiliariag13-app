import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { RegisterModalComponent } from './register-modal.component';

describe('RegisterModalComponent', () => {
  let component: RegisterModalComponent;
  let fixture: ComponentFixture<RegisterModalComponent>;
  let activeModalSpy: jasmine.SpyObj<NgbActiveModal>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['registerWithCognito']);

    await TestBed.configureTestingModule({
      imports: [RegisterModalComponent],
      providers: [
        { provide: NgbActiveModal, useValue: activeModalSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService and close modal when register is invoked', () => {
    component.register();
    expect(authServiceSpy.registerWithCognito).toHaveBeenCalledTimes(1);
    expect(activeModalSpy.close).toHaveBeenCalledTimes(1);
  });

  it('should close modal when closeModal is called', () => {
    component.closeModal();
    expect(activeModalSpy.close).toHaveBeenCalledTimes(1);
  });
});
