import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { ClienteService } from '../../services/cliente.service';
import { ContratoService } from '../../services/contrato.service';
import { UnidadService } from '../../services/unidad.service';
import { ContratosComponent } from './contratos.component';

describe('ContratosComponent', () => {
  let component: ContratosComponent;
  let fixture: ComponentFixture<ContratosComponent>;
  let clienteServiceSpy: any;
  let unidadServiceSpy: any;
  let contratoServiceSpy: any;

  beforeEach(async () => {
    clienteServiceSpy = jasmine.createSpyObj('ClienteService', ['getClientes']);
    unidadServiceSpy = jasmine.createSpyObj('UnidadService', ['getUnidades']);
    contratoServiceSpy = jasmine.createSpyObj('ContratoService', ['getContratos', 'createContrato', 'deleteContrato']);

    clienteServiceSpy.getClientes.and.returnValue(of({ data: [] }));
    unidadServiceSpy.getUnidades.and.returnValue(of({ data: [] }));
    contratoServiceSpy.getContratos.and.returnValue(of({ data: [] }));

    await TestBed.configureTestingModule({
      imports: [
        ContratosComponent,
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: ClienteService, useValue: clienteServiceSpy },
        { provide: UnidadService, useValue: unidadServiceSpy },
        { provide: ContratoService, useValue: contratoServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar clientes y unidades al iniciar', () => {
    expect(clienteServiceSpy.getClientes).toHaveBeenCalledTimes(1);
    expect(unidadServiceSpy.getUnidades).toHaveBeenCalledTimes(1);
    expect(component.clientes).toEqual([]);
    expect(component.unidades).toEqual([]);
  });

  it('debería cargar contratos correctamente', () => {
    expect(contratoServiceSpy.getContratos).toHaveBeenCalledTimes(1);
    expect(component.contratos).toEqual([]);
  });

  it('debería crear un contrato', () => {
    contratoServiceSpy.createContrato.and.returnValue(of({}));

    component.contratoForm.setValue({
      cliente_id: 1,
      unidad_id: 1,
      tipo_contrato: 'arriendo',
      fecha_inicio: '2024-01-01',
      fecha_fin: '2024-12-01',
      monto_total: 500000
    });

    component.crearContrato();

    expect(contratoServiceSpy.createContrato).toHaveBeenCalledTimes(1);
  });

  it('debería eliminar un contrato', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    contratoServiceSpy.deleteContrato.and.returnValue(of({}));

    component.eliminarContrato(5);

    expect(contratoServiceSpy.deleteContrato).toHaveBeenCalledWith(5);
  });
});
