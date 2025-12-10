import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NeonCardComponent } from './neon-card.component';

describe('NeonCardComponent', () => {
  let component: NeonCardComponent;
  let fixture: ComponentFixture<NeonCardComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeonCardComponent, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(NeonCardComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });
  // ==========================================================
  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });
  // ==========================================================
  it('NO debe llamar HTTP ni emitir evento si contratoId no viene', () => {
    spyOn(console, 'error');

    component.contratoId = undefined as any;     // sin ID
    component.iniciarPago();

    expect(console.error).toHaveBeenCalledWith('No se recibió contratoId en NeonCard');

    // No debe haber request HTTP
    httpMock.expectNone('http://127.0.0.1:8000/api/pagos/undefined/init');
  });
  // ==========================================================
  it('debe poner loading en true mientras espera y volver a false al finalizar', () => {
    component.contratoId = 10;

    component.iniciarPago();
    expect(component.loading).toBeTrue();

    const mockReq = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/10/init');

    mockReq.flush({
      status: 'ok',
      pago: { id: 5 }
    });

    expect(component.loading).toBeFalse();
  });

  // ==========================================================
  it('debe emitir paymentStarted con el id recibido del backend', () => {
    component.contratoId = 7;

    const spy = spyOn(component.paymentStarted, 'emit');

    component.iniciarPago();

    const mockReq = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/7/init');

    mockReq.flush({
      status: 'ok',
      pago: { id: 123 }
    });

    expect(spy).toHaveBeenCalledOnceWith(123);
  });

  // ==========================================================
  it('debe mostrar error si backend NO devuelve pago.id', () => {
    spyOn(console, 'error');
    const emitSpy = spyOn(component.paymentStarted, 'emit');

    component.contratoId = 7;
    component.iniciarPago();

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/7/init');

    req.flush({
      status: 'ok',
      pago: {}   // ❌ sin id
    });

    expect(console.error).toHaveBeenCalled();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('debe manejar error HTTP y poner loading en false', () => {
    spyOn(console, 'error');

    component.contratoId = 55;
    component.iniciarPago();

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/55/init');

    req.flush('Error del servidor', { status: 500, statusText: 'Server Error' });

    expect(console.error).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

});
