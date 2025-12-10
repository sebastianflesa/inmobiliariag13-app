import { CommonModule } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { OtpScreenComponent } from './otp-screen.component';

describe('OtpScreenComponent', () => {
  let component: OtpScreenComponent;
  let fixture: ComponentFixture<OtpScreenComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpScreenComponent, HttpClientTestingModule, FormsModule, CommonModule]
    }).compileComponents();

    fixture = TestBed.createComponent(OtpScreenComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    component.ngOnDestroy(); // Limpiar timers
    httpMock.verify();
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  describe('generarOtp', () => {
    it('no debe generar OTP si sessionId es inválido (0)', () => {
      component.sessionId = 0;
      component.generarOtp();
      httpMock.expectNone((req: any) => req.url.includes('/otp'));
    });

    it('no debe generar OTP si sessionId es undefined', () => {
      component.sessionId = undefined as any;
      component.generarOtp();
      httpMock.expectNone((req: any) => req.url.includes('/otp'));
    });

    it('debe generar OTP correctamente y limpiar input anterior', fakeAsync(() => {
      component.sessionId = 12;
      component.otp = 'old-value';

      component.generarOtp();

      expect(component.loading).toBeTrue();
      expect(component.otp).toBe('');

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/12/otp');
      req.flush({ otp: '111222', expires_in: 30 });

      tick();

      expect(component.loading).toBeFalse();
      expect(component.generated).toBeTrue();
      expect(component.generatedOtp).toBe('111222');
      expect(component.timeRemaining).toBe(30);

      // Limpiar timer pendiente
      component.ngOnDestroy();
      flush();
    }));

    it('debe usar 20 segundos por defecto si expires_in no viene', fakeAsync(() => {
      component.sessionId = 15;

      component.generarOtp();

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/15/otp');
      req.flush({ otp: '123456' });

      tick();

      expect(component.timeRemaining).toBe(20);

      // Limpiar timer pendiente
      component.ngOnDestroy();
      flush();
    }));

    it('debe manejar error al generar OTP y mostrar alert', () => {
      spyOn(window, 'alert');
      component.sessionId = 8;

      component.generarOtp();

      expect(component.loading).toBeTrue();

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/8/otp');
      req.flush('error', { status: 500, statusText: 'err' });

      expect(component.loading).toBeFalse();
      expect(component.generated).toBeFalse();
      expect(window.alert).toHaveBeenCalledWith('Error al generar OTP. Intenta nuevamente.');
    });

    it('debe iniciar el timer después de generar OTP', fakeAsync(() => {
      component.sessionId = 20;

      component.generarOtp();

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/20/otp');
      req.flush({ otp: '999888', expires_in: 5 });

      tick();

      expect(component.timeRemaining).toBe(5);

      tick(1000);
      expect(component.timeRemaining).toBe(4);

      tick(1000);
      expect(component.timeRemaining).toBe(3);

      tick(3000);
      expect(component.timeRemaining).toBe(0);

      // Limpiar cualquier timer residual
      flush();
    }));
  });

  describe('validarOtp', () => {
    it('no debe validar OTP si es menor a 6 caracteres', () => {
      spyOn(window, 'alert');
      const spy = spyOn(component.otpValidated, 'emit');
      component.sessionId = 33;
      component.otp = '12 3';

      component.validarOtp();

      httpMock.expectNone((req: any) => req.url.includes('/validar'));
      expect(spy).not.toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Debes ingresar los 6 dígitos');
    });

    it('no debe validar si timeRemaining es 0', () => {
      spyOn(window, 'alert');
      const spy = spyOn(component.otpValidated, 'emit');
      component.sessionId = 40;
      component.otp = '123456';
      component.timeRemaining = 0;

      component.validarOtp();

      httpMock.expectNone((req: any) => req.url.includes('/validar'));
      expect(spy).not.toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('El código ha expirado. Solicita uno nuevo.');
    });

    it('debe limpiar espacios en blanco del OTP antes de enviar', () => {
      component.sessionId = 50;
      component.otp = '1 2 3 4 5 6';
      component.timeRemaining = 10;

      component.validarOtp();

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/50/otp/validar');
      expect(req.request.body.otp).toBe('123456');
      req.flush({ status: 'success' });
    });

    it('debe validar OTP y emitir approved cuando status es success', () => {
      const spy = spyOn(component.otpValidated, 'emit');
      component.sessionId = 44;
      component.otp = '111222';
      component.timeRemaining = 15;

      component.validarOtp();

      expect(component.loading).toBeTrue();

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/44/otp/validar');
      req.flush({ status: 'success' });

      expect(component.loading).toBeFalse();
      expect(spy).toHaveBeenCalledOnceWith('approved');
    });

    it('debe validar OTP y emitir approved cuando status es ok', () => {
      const spy = spyOn(component.otpValidated, 'emit');
      component.sessionId = 45;
      component.otp = '777888';
      component.timeRemaining = 10;

      component.validarOtp();

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/45/otp/validar');
      req.flush({ status: 'ok' });

      expect(spy).toHaveBeenCalledOnceWith('approved');
    });

    it('debe emitir rejected cuando status no es success ni ok', () => {
      const spy = spyOn(component.otpValidated, 'emit');
      component.sessionId = 55;
      component.otp = '999888';
      component.timeRemaining = 20;

      component.validarOtp();

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/55/otp/validar');
      req.flush({ status: 'fail' });

      expect(component.loading).toBeFalse();
      expect(spy).toHaveBeenCalledOnceWith('rejected');
    });

    it('debe emitir rejected en error HTTP', () => {
      const spy = spyOn(component.otpValidated, 'emit');
      component.sessionId = 99;
      component.otp = '333444';
      component.timeRemaining = 18;

      component.validarOtp();

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/99/otp/validar');
      req.flush('err', { status: 500, statusText: 'Server error' });

      expect(component.loading).toBeFalse();
      expect(spy).toHaveBeenCalledOnceWith('rejected');
    });

    it('debe detener el timer al validar correctamente', fakeAsync(() => {
      component.sessionId = 60;

      component.generarOtp();
      const genReq = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/60/otp');
      genReq.flush({ otp: '123456', expires_in: 10 });
      tick();

      component.otp = '123456';
      component.validarOtp();

      const valReq = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/60/otp/validar');
      valReq.flush({ status: 'success' });

      const timeBeforeAdvance = component.timeRemaining;
      tick(5000);

      expect(component.timeRemaining).toBe(timeBeforeAdvance);
      flush();
    }));

    it('debe detener el timer al validar con error', fakeAsync(() => {
      component.sessionId = 70;

      component.generarOtp();
      const genReq = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/70/otp');
      genReq.flush({ otp: '654321', expires_in: 15 });
      tick();

      component.otp = '654321';
      component.validarOtp();

      const valReq = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/70/otp/validar');
      valReq.flush('error', { status: 400, statusText: 'Bad Request' });

      const timeBeforeAdvance = component.timeRemaining;
      tick(3000);

      expect(component.timeRemaining).toBe(timeBeforeAdvance);
      flush();
    }));
  });

  describe('Timer functionality', () => {
    it('debe decrementar timeRemaining cada segundo', fakeAsync(() => {
      component.sessionId = 100;

      component.generarOtp();

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/100/otp');
      req.flush({ otp: '111111', expires_in: 10 });

      tick();
      expect(component.timeRemaining).toBe(10);

      tick(1000);
      expect(component.timeRemaining).toBe(9);

      tick(2000);
      expect(component.timeRemaining).toBe(7);

      // Limpiar timer
      component.ngOnDestroy();
      flush();
    }));

    it('debe detener el timer cuando timeRemaining llega a 0', fakeAsync(() => {
      component.sessionId = 110;

      component.generarOtp();

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/110/otp');
      req.flush({ otp: '222222', expires_in: 3 });

      tick();

      tick(3000);

      expect(component.timeRemaining).toBe(0);

      tick(2000);
      expect(component.timeRemaining).toBe(0);

      flush();
    }));

    it('debe limpiar timer anterior al generar nuevo OTP', fakeAsync(() => {
      component.sessionId = 120;

      component.generarOtp();
      const req1 = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/120/otp');
      req1.flush({ otp: '111111', expires_in: 20 });
      tick();

      tick(5000);
      expect(component.timeRemaining).toBe(15);

      component.generarOtp();
      const req2 = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/120/otp');
      req2.flush({ otp: '222222', expires_in: 30 });
      tick();

      expect(component.timeRemaining).toBe(30);

      tick(1000);
      expect(component.timeRemaining).toBe(29);

      // Limpiar timer
      component.ngOnDestroy();
      flush();
    }));
  });

  describe('ngOnDestroy', () => {
    it('debe detener el timer al destruir el componente', fakeAsync(() => {
      component.sessionId = 130;

      component.generarOtp();
      const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/130/otp');
      req.flush({ otp: '333333', expires_in: 20 });
      tick();

      expect(component.timeRemaining).toBe(20);

      tick(2000);
      expect(component.timeRemaining).toBe(18);

      component.ngOnDestroy();

      tick(5000);
      expect(component.timeRemaining).toBe(18);

      flush();
    }));

    it('debe manejar ngOnDestroy sin timer activo', () => {
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });
});