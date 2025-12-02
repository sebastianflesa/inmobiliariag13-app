import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NeonpayComponent } from './neonpay.component';

describe('NeonpayComponent', () => {
  let component: NeonpayComponent;
  let fixture: ComponentFixture<NeonpayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeonpayComponent, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '10' // simulamos /neonpay/10
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NeonpayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar contratoId desde la ruta', () => {
    component.ngOnInit();
    expect(component.contratoId).toBe(10);
  });

  it('debería cambiar a step 2 cuando inicia el pago', () => {
    component.onPaymentStarted(55);
    expect(component.paymentId).toBe(55);
    expect(component.step).toBe(2);
  });

  it('debería avanzar a step 3 si el PIN es válido', () => {
    component.onPinValidated(true);
    expect(component.step).toBe(3);
  });

  it('debería ir a step 4 y marcar rechazo si el PIN es inválido', () => {
    component.onPinValidated(false);
    expect(component.step).toBe(4);
    expect(component.paymentResult).toEqual({ status: 'rejected', message: 'PIN incorrecto' });
  });

  it('debería aprobar OTP', () => {
    component.onOtpValidated('approved');
    expect(component.step).toBe(4);
    expect(component.paymentResult).toEqual({ status: 'approved' });
  });

  it('debería rechazar OTP', () => {
    component.onOtpValidated('rejected');
    expect(component.step).toBe(4);
    expect(component.paymentResult).toEqual({ status: 'rejected', message: 'OTP inválido' });
  });

  it('debería reiniciar el flujo', () => {
    component.step = 4;
    component.paymentId = 99;
    component.paymentResult = { status: 'approved' };

    component.restart();

    expect(component.step).toBe(1);
    expect(component.paymentId).toBeNull();
    expect(component.paymentResult).toBeNull();
  });
});
