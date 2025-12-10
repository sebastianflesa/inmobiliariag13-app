import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PinScreenComponent } from './pin-screen.component';

describe('PinScreenComponent', () => {
  let component: PinScreenComponent;
  let fixture: ComponentFixture<PinScreenComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PinScreenComponent, HttpClientTestingModule, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PinScreenComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  describe('sendPin', () => {
    it('no debe enviar si el PIN no tiene largo 4', () => {
      const spy = spyOn(component.pinValidated, 'emit');
      component.pin = '12';
      component.sessionId = 10;

      component.sendPin();

      httpMock.expectNone((req: any) => req.url.includes('/pin'));
      expect(spy).not.toHaveBeenCalled();
    });

    it('no debe enviar si el PIN es vacío', () => {
      const spy = spyOn(component.pinValidated, 'emit');
      component.pin = '';
      component.sessionId = 10;

      component.sendPin();

      httpMock.expectNone((req: any) => req.url.includes('/pin'));
      expect(spy).not.toHaveBeenCalled();
    });

    it('no debe enviar si el PIN es mayor a 4', () => {
      const spy = spyOn(component.pinValidated, 'emit');
      component.pin = '12345';
      component.sessionId = 10;

      component.sendPin();

      httpMock.expectNone((req: any) => req.url.includes('/pin'));
      expect(spy).not.toHaveBeenCalled();
    });

    it('debe enviar PIN válido y manejar loading', () => {
      component.pin = '1234';
      component.sessionId = 44;

      component.sendPin();

      expect(component.loading).toBeTrue();

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/44/pin');
      req.flush({ status: 'ok', pago: { pin_validado: true } });

      expect(component.loading).toBeFalse();
    });

    it('debe emitir true si backend responde status ok', () => {
      component.pin = '1234';
      component.sessionId = 7;
      const spy = spyOn(component.pinValidated, 'emit');

      component.sendPin();

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/7/pin');
      req.flush({ status: 'ok' });

      expect(spy).toHaveBeenCalledOnceWith(true);
    });

    it('debe emitir true si res.pago.pin_validado = true', () => {
      component.pin = '1234';
      component.sessionId = 9;
      const spy = spyOn(component.pinValidated, 'emit');

      component.sendPin();

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/9/pin');
      req.flush({ pago: { pin_validado: true } });

      expect(spy).toHaveBeenCalledOnceWith(true);
    });

    it('debe emitir true si ambos status ok y pin_validado true', () => {
      component.pin = '1234';
      component.sessionId = 15;
      const spy = spyOn(component.pinValidated, 'emit');

      component.sendPin();

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/15/pin');
      req.flush({ status: 'ok', pago: { pin_validado: true } });

      expect(spy).toHaveBeenCalledOnceWith(true);
    });

    it('debe emitir false si backend no valida el PIN', () => {
      component.pin = '1234';
      component.sessionId = 11;
      const spy = spyOn(component.pinValidated, 'emit');

      component.sendPin();

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/11/pin');
      req.flush({ status: 'fail' });

      expect(spy).toHaveBeenCalledOnceWith(false);
    });

    it('debe emitir false si res es null', () => {
      component.pin = '1234';
      component.sessionId = 12;
      const spy = spyOn(component.pinValidated, 'emit');

      component.sendPin();

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/12/pin');
      req.flush(null);

      expect(spy).toHaveBeenCalledOnceWith(false);
    });

    it('debe emitir false si res.pago es null', () => {
      component.pin = '1234';
      component.sessionId = 13;
      const spy = spyOn(component.pinValidated, 'emit');

      component.sendPin();

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/13/pin');
      req.flush({ pago: null });

      expect(spy).toHaveBeenCalledOnceWith(false);
    });

    it('debe emitir false si res.pago.pin_validado es false', () => {
      component.pin = '1234';
      component.sessionId = 14;
      const spy = spyOn(component.pinValidated, 'emit');

      component.sendPin();

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/14/pin');
      req.flush({ pago: { pin_validado: false } });

      expect(spy).toHaveBeenCalledOnceWith(false);
    });

    it('debe emitir false en error HTTP', () => {
      component.pin = '1234';
      component.sessionId = 22;
      const spy = spyOn(component.pinValidated, 'emit');

      component.sendPin();

      const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/22/pin');
      req.flush('error', { status: 500, statusText: 'Server error' });

      expect(component.loading).toBeFalse();
      expect(spy).toHaveBeenCalledOnceWith(false);
    });
  });

  describe('addDigit', () => {
    it('debe agregar dígito si el PIN tiene menos de 4 caracteres', () => {
      component.pin = '12';
      component.loading = false;

      component.addDigit(3);

      expect(component.pin).toBe('123');
    });

    it('no debe agregar dígito si el PIN ya tiene 4 caracteres', () => {
      component.pin = '1234';
      component.loading = false;

      component.addDigit(5);

      expect(component.pin).toBe('1234');
    });

    it('no debe agregar dígito si está loading', () => {
      component.pin = '12';
      component.loading = true;

      component.addDigit(3);

      expect(component.pin).toBe('12');
    });

    it('debe agregar dígito 0', () => {
      component.pin = '123';
      component.loading = false;

      component.addDigit(0);

      expect(component.pin).toBe('1230');
    });
  });

  describe('clearPin', () => {
    it('debe eliminar el último dígito del PIN', () => {
      component.pin = '1234';

      component.clearPin();

      expect(component.pin).toBe('123');
    });

    it('debe eliminar el último dígito si hay solo uno', () => {
      component.pin = '1';

      component.clearPin();

      expect(component.pin).toBe('');
    });

    it('no debe hacer nada si el PIN está vacío', () => {
      component.pin = '';

      component.clearPin();

      expect(component.pin).toBe('');
    });
  });
});