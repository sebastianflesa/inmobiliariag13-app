import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { ContratoService } from '../../services/contrato.service';
import { PagoService } from '../../services/pago.service';
import { PagosComponent } from './pagos.component';

describe('PagosComponent', () => {
  let component: PagosComponent;
  let fixture: ComponentFixture<PagosComponent>;
  let pagoServiceSpy: any;
  let contratoServiceSpy: any;

  beforeEach(async () => {
    pagoServiceSpy = jasmine.createSpyObj('PagoService', ['getPagos', 'createPago', 'deletePago']);
    contratoServiceSpy = jasmine.createSpyObj('ContratoService', ['getContratos']);

    pagoServiceSpy.getPagos.and.returnValue(of([]));
    contratoServiceSpy.getContratos.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [PagosComponent, HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        { provide: PagoService, useValue: pagoServiceSpy },
        { provide: ContratoService, useValue: contratoServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.pagoForm.valid).toBeFalse();
  });

  it('form should be valid with correct values', () => {
    component.pagoForm.setValue({
      contrato_id: 1,
      monto: 10000,
      fecha_pago: '2025-01-01',
      metodo_pago: 'transferencia',
      estado: 'pendiente'
    });
    expect(component.pagoForm.valid).toBeTrue();
  });

  it('should load contratos', () => {
    contratoServiceSpy.getContratos.and.returnValue(of([{ id: 1 }]));
    component.loadLookups();
    expect(contratoServiceSpy.getContratos).toHaveBeenCalled();
    expect(component.contratos.length).toBe(1);
    expect(component.loading).toBeFalse();
  });

  it('should handle error loading contratos', () => {
    contratoServiceSpy.getContratos.and.returnValue(throwError(() => 'Error'));
    component.loadLookups();
    expect(component.error).toBe('Error cargando contratos');
    expect(component.loading).toBeFalse();
  });

  it('should handle contratos response as object with data', () => {
    contratoServiceSpy.getContratos.and.returnValue(of({ data: [{ id: 2 }] }));
    component.loadLookups();
    expect(component.contratos.length).toBe(1);
  });

  it('should load pagos', () => {
    pagoServiceSpy.getPagos.and.returnValue(of([{ id: 100 }]));
    component.loadPagos();
    expect(pagoServiceSpy.getPagos).toHaveBeenCalled();
    expect(component.pagos.length).toBe(1);
    expect(component.loading).toBeFalse();
  });

  it('should handle error loading pagos', () => {
    pagoServiceSpy.getPagos.and.returnValue(throwError(() => 'Error'));
    component.loadPagos();
    expect(component.error).toBe('Error cargando pagos');
    expect(component.loading).toBeFalse();
  });

  it('should handle pagos response as object with data', () => {
    pagoServiceSpy.getPagos.and.returnValue(of({ data: [{ id: 101 }] }));
    component.loadPagos();
    expect(component.pagos.length).toBe(1);
  });

  it('should not create pago if form is invalid', () => {
    component.crearPago();
    expect(component.saving).toBeFalse();
    expect(pagoServiceSpy.createPago).not.toHaveBeenCalled();
  });

  it('should create pago', () => {
    pagoServiceSpy.createPago.and.returnValue(of({}));
    component.pagoForm.setValue({
      contrato_id: 1,
      monto: 50000,
      fecha_pago: '2025-11-29',
      metodo_pago: 'transferencia',
      estado: 'pendiente'
    });
    component.crearPago();
    expect(pagoServiceSpy.createPago).toHaveBeenCalled();
    expect(component.saving).toBeFalse();
  });

  it('should handle error creating pago', () => {
    pagoServiceSpy.createPago.and.returnValue(throwError(() => ({ error: { message: 'Falló' } })));
    component.pagoForm.setValue({
      contrato_id: 1,
      monto: 50000,
      fecha_pago: '2025-11-29',
      metodo_pago: 'transferencia',
      estado: 'pendiente'
    });
    component.crearPago();
    expect(component.error).toBe('Falló');
    expect(component.saving).toBeFalse();
  });

  it('should delete pago when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    pagoServiceSpy.deletePago.and.returnValue(of({}));
    pagoServiceSpy.getPagos.and.returnValue(of([]));

    component.eliminarPago(1);
    expect(pagoServiceSpy.deletePago).toHaveBeenCalledWith(1);
  });

  it('should handle error deleting pago', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    pagoServiceSpy.deletePago.and.returnValue(throwError(() => 'Error'));
    component.eliminarPago(1);
    expect(component.error).toBe('Error eliminando pago');
  });

  it('should NOT delete pago when confirm is cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.eliminarPago(1);
    expect(pagoServiceSpy.deletePago).not.toHaveBeenCalled();
  });

  it('should unsubscribe on destroy', () => {
    const sub = { unsubscribe: jasmine.createSpy('unsubscribe') };
    component['subs'].push(sub as any);
    component.ngOnDestroy();
    expect(sub.unsubscribe).toHaveBeenCalled();
  });
});
