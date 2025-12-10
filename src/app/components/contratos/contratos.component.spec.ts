import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ClienteService } from '../../services/cliente.service';
import { ContratoService } from '../../services/contrato.service';
import { UnidadService } from '../../services/unidad.service';
import { ContratosComponent } from './contratos.component';

describe('ContratosComponent', () => {
  let component: ContratosComponent;
  let fixture: ComponentFixture<ContratosComponent>;
  let contratoService: ContratoService;
  let clienteService: ClienteService;
  let unidadService: UnidadService;

  const mockClientes = [
    { rut: '12345678-9', nombre: 'Cliente 1', apellido: 'Apellido 1', email: 'cliente1@example.com', telefono: '123456789' }
  ];

  const mockUnidades = [
    { id: '1', nombre: 'Unidad 1' }
  ];

  const mockContratos = [
    { id: 1, cliente_id: '1', unidad_id: '1', tipo_contrato: 'arriendo', fecha_inicio: '2024-01-01', fecha_fin: '2024-12-31', monto_total: 1000, estado: 'activo' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, CommonModule],
      declarations: [],
      providers: [FormBuilder, ClienteService, ContratoService, UnidadService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ContratosComponent);
    component = fixture.componentInstance;
    contratoService = TestBed.inject(ContratoService);
    clienteService = TestBed.inject(ClienteService);
    unidadService = TestBed.inject(UnidadService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load clientes and unidades on init', fakeAsync(() => {
      spyOn(clienteService, 'getClientes').and.returnValue(of(mockClientes));
      spyOn(unidadService, 'getUnidades').and.returnValue(of(mockUnidades));
      spyOn(contratoService, 'getContratos').and.returnValue(of(mockContratos));

      fixture.detectChanges();
      tick();

      expect(component.clientes).toEqual(mockClientes);
      expect(component.unidades).toEqual(mockUnidades);
      expect(component.loading).toBeFalse();
    }));

    it('should load contratos on init', fakeAsync(() => {
      spyOn(clienteService, 'getClientes').and.returnValue(of(mockClientes));
      spyOn(unidadService, 'getUnidades').and.returnValue(of(mockUnidades));
      spyOn(contratoService, 'getContratos').and.returnValue(of(mockContratos));

      fixture.detectChanges();
      tick();

      expect(component.contratos).toEqual(mockContratos);
    }));

    it('should handle clientes as object with data property', fakeAsync(() => {
      spyOn(clienteService, 'getClientes').and.returnValue(of({ data: mockClientes }) as any);
      spyOn(unidadService, 'getUnidades').and.returnValue(of(mockUnidades));
      spyOn(contratoService, 'getContratos').and.returnValue(of(mockContratos));

      fixture.detectChanges();
      tick();

      expect(component.clientes).toEqual(mockClientes);
    }));

    it('should handle unidades as object with data property', fakeAsync(() => {
      spyOn(clienteService, 'getClientes').and.returnValue(of(mockClientes));
      spyOn(unidadService, 'getUnidades').and.returnValue(of({ data: mockUnidades }) as any);
      spyOn(contratoService, 'getContratos').and.returnValue(of(mockContratos));

      fixture.detectChanges();
      tick();

      expect(component.unidades).toEqual(mockUnidades);
    }));

    it('should handle error loading lookup data', fakeAsync(() => {
      spyOn(clienteService, 'getClientes').and.returnValue(throwError({ error: 'Error' }));
      spyOn(unidadService, 'getUnidades').and.returnValue(of(mockUnidades));
      spyOn(contratoService, 'getContratos').and.returnValue(of(mockContratos));

      fixture.detectChanges();
      tick();

      expect(component.error).toBe('Error al cargar clientes o unidades');
      expect(component.loading).toBeFalse();
    }));
  });

  describe('loadContratos', () => {
    it('should load contratos as array', fakeAsync(() => {
      spyOn(contratoService, 'getContratos').and.returnValue(of(mockContratos));

      component.loadContratos();
      tick();

      expect(component.contratos).toEqual(mockContratos);
      expect(component.loading).toBeFalse();
    }));

    it('should load contratos as object with data property', fakeAsync(() => {
      spyOn(contratoService, 'getContratos').and.returnValue(of({ data: mockContratos }) as any);

      component.loadContratos();
      tick();

      expect(component.contratos).toEqual(mockContratos);
    }));

    it('should handle error loading contratos', fakeAsync(() => {
      spyOn(contratoService, 'getContratos').and.returnValue(throwError({ error: 'Error' }));

      component.loadContratos();
      tick();

      expect(component.error).toBe('Error al cargar contratos');
      expect(component.loading).toBeFalse();
    }));
  });

  describe('crearContrato', () => {
    it('should create contrato successfully', fakeAsync(() => {
      const createContratoSpy = spyOn(contratoService, 'createContrato').and.returnValue(of(mockContratos[0]));
      const loadContratosSpy = spyOn(component, 'loadContratos');

      component.contratoForm.patchValue({
        cliente_id: '1',
        unidad_id: '1',
        tipo_contrato: 'arriendo',
        fecha_inicio: '2024-01-01',
        fecha_fin: '2024-12-31',
        monto_total: 1000,
        estado: 'activo'
      });

      expect(component.contratoForm.valid).toBeTruthy();

      component.crearContrato();
      tick();

      expect(createContratoSpy).toHaveBeenCalledTimes(1);
      expect(component.saving).toBeFalse();
      expect(loadContratosSpy).toHaveBeenCalled();
      expect(component.contratoForm.value.tipo_contrato).toBe('arriendo');
    }));

    it('should not create contrato if form is invalid', () => {
      const createContratoSpy = spyOn(contratoService, 'createContrato').and.returnValue(of(mockContratos[0]));
      const markAllAsTouchedSpy = spyOn(component.contratoForm, 'markAllAsTouched');

      component.contratoForm.reset();

      component.crearContrato();

      expect(createContratoSpy).not.toHaveBeenCalled();
      expect(markAllAsTouchedSpy).toHaveBeenCalled();
      expect(component.contratoForm.invalid).toBeTruthy();
    });

    it('should handle error creating contrato with error message', fakeAsync(() => {
      spyOn(contratoService, 'createContrato').and.returnValue(
        throwError({ error: { message: 'Custom error message' } })
      );

      component.contratoForm.patchValue({
        cliente_id: '1',
        unidad_id: '1',
        tipo_contrato: 'arriendo',
        fecha_inicio: '2024-01-01',
        fecha_fin: '2024-12-31',
        monto_total: 1000,
        estado: 'activo'
      });

      component.crearContrato();
      tick();

      expect(component.error).toBe('Custom error message');
      expect(component.saving).toBeFalse();
    }));

    it('should handle error creating contrato without error message', fakeAsync(() => {
      spyOn(contratoService, 'createContrato').and.returnValue(
        throwError({ error: {} })
      );

      component.contratoForm.patchValue({
        cliente_id: '1',
        unidad_id: '1',
        tipo_contrato: 'arriendo',
        fecha_inicio: '2024-01-01',
        fecha_fin: '2024-12-31',
        monto_total: 1000,
        estado: 'activo'
      });

      component.crearContrato();
      tick();

      expect(component.error).toBe('Error creando contrato');
      expect(component.saving).toBeFalse();
    }));
  });

  describe('eliminarContrato', () => {
    it('should delete contrato when confirmed', fakeAsync(() => {
      spyOn(contratoService, 'deleteContrato').and.returnValue(of({}));
      spyOn(window, 'confirm').and.returnValue(true);
      const loadContratosSpy = spyOn(component, 'loadContratos');

      component.eliminarContrato(1);
      tick();

      expect(contratoService.deleteContrato).toHaveBeenCalledTimes(1);
      expect(contratoService.deleteContrato).toHaveBeenCalledWith(1);
      expect(loadContratosSpy).toHaveBeenCalled();
    }));

    it('should not delete contrato when not confirmed', () => {
      const deleteContratoSpy = spyOn(contratoService, 'deleteContrato').and.returnValue(of({}));
      spyOn(window, 'confirm').and.returnValue(false);

      component.eliminarContrato(1);

      expect(deleteContratoSpy).not.toHaveBeenCalled();
    });

    it('should handle error on delete contrato', fakeAsync(() => {
      spyOn(contratoService, 'deleteContrato').and.returnValue(throwError({ error: 'Error' }));
      spyOn(window, 'confirm').and.returnValue(true);

      component.eliminarContrato(1);
      tick();

      expect(component.error).toBe('Error eliminando contrato');
    }));
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe all subscriptions', fakeAsync(() => {
      spyOn(clienteService, 'getClientes').and.returnValue(of(mockClientes));
      spyOn(unidadService, 'getUnidades').and.returnValue(of(mockUnidades));
      spyOn(contratoService, 'getContratos').and.returnValue(of(mockContratos));

      fixture.detectChanges();
      tick();

      const subs = component['subs'];
      subs.forEach(sub => spyOn(sub, 'unsubscribe'));

      component.ngOnDestroy();

      subs.forEach(sub => expect(sub.unsubscribe).toHaveBeenCalledTimes(1));
    }));

    it('should handle subscriptions without unsubscribe method', () => {
      // Crear objetos sin el método unsubscribe
      component['subs'] = [
        {} as any,
        { someOtherMethod: () => { } } as any
      ];

      // No debería lanzar error gracias al && unsubscribe
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });
});