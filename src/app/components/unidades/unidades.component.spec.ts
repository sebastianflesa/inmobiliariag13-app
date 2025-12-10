import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { ClienteService } from '../../services/cliente.service';
import { ProyectoService } from '../../services/proyecto.service';
import { UnidadService } from '../../services/unidad.service';
import { UnidadesComponent } from './unidades.component';

describe('UnidadesComponent', () => {
  let component: UnidadesComponent;
  let fixture: ComponentFixture<UnidadesComponent>;

  let unidadService: jasmine.SpyObj<UnidadService>;
  let proyectoService: jasmine.SpyObj<ProyectoService>;
  let clienteService: jasmine.SpyObj<ClienteService>;

  beforeEach(async () => {
    const unidadSpy = jasmine.createSpyObj('UnidadService', [
      'getUnidades',
      'crearUnidad',
      'editarUnidad',
      'eliminarUnidad'
    ]);

    const proyectoSpy = jasmine.createSpyObj('ProyectoService', ['getProyectos']);
    const clienteSpy = jasmine.createSpyObj('ClienteService', ['getClientes']);

    await TestBed.configureTestingModule({
      imports: [UnidadesComponent, HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        { provide: UnidadService, useValue: unidadSpy },
        { provide: ProyectoService, useValue: proyectoSpy },
        { provide: ClienteService, useValue: clienteSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UnidadesComponent);
    component = fixture.componentInstance;

    unidadService = TestBed.inject(UnidadService) as jasmine.SpyObj<UnidadService>;
    proyectoService = TestBed.inject(ProyectoService) as jasmine.SpyObj<ProyectoService>;
    clienteService = TestBed.inject(ClienteService) as jasmine.SpyObj<ClienteService>;

    // ==== DATOS CORREGIDOS ====
    unidadService.getUnidades.and.returnValue(
      of({
        data: [
          {
            id: "1",
            numero_unidad: "10",
            tipo_unidad: "Depto",
            metraje: "40",
            precio_venta: "70000000",
            estado: "Disponible",
            proyecto_id: "1",
            cliente_id: "1"
          }
        ]
      })
    );

    proyectoService.getProyectos.and.returnValue(
      of({
        data: [{ id: "1", nombre: "Proyecto X" }]
      })
    );

    (clienteService.getClientes as jasmine.Spy).and.returnValue(
      of({
        data: [
          {
            id: "1",
            rut: "11.111.111-1",
            nombre: "Test",
            apellido: "User",
            email: "test@test.com",
            telefono: "12345678"
          }
        ]
      }) as any
    );


    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debe cargar unidades, proyectos y clientes', () => {
    expect(unidadService.getUnidades).toHaveBeenCalled();
    expect(proyectoService.getProyectos).toHaveBeenCalled();
    expect(clienteService.getClientes).toHaveBeenCalled();
    expect(component.unidades.length).toBe(1);
  });

  it('debería tener formulario inválido al inicio', () => {
    expect(component.unidadForm.valid).toBeFalse();
  });

  it('debería validar correctamente un formulario válido', () => {
    component.unidadForm.setValue({
      numero_unidad: '101',
      tipo_unidad: 'Departamento',
      metraje: 45,
      precio_venta: 90000000,
      estado: 'Disponible',
      proyecto_id: '1',
      cliente_id: '1'
    });
    expect(component.unidadForm.valid).toBeTrue();
  });

  it('crearUnidad debe llamar alert al intentar enviar formulario inválido', () => {
    spyOn(window, 'alert');
    component.unidadForm.patchValue({ numero_unidad: '' });

    component.crearUnidad();

    expect(window.alert).toHaveBeenCalledWith("Los valores deben ser mayores a 0");
  });

  it('crearUnidad debe rechazar metraje o precio menores a 1', () => {
    spyOn(window, 'alert');

    component.unidadForm.get('metraje')?.clearValidators();
    component.unidadForm.get('precio_venta')?.clearValidators();
    component.unidadForm.updateValueAndValidity();

    component.unidadForm.setValue({
      numero_unidad: '101',
      tipo_unidad: 'Depto',
      metraje: 0,
      precio_venta: 0,
      estado: 'Disponible',
      proyecto_id: '1',
      cliente_id: '1'
    });

    component.crearUnidad();

    expect(window.alert).toHaveBeenCalledWith("Valores inválidos: deben ser mayores a 0.");
  });


  it('debería crear una unidad si el formulario es válido y no está en modo edición', () => {
    component.modoEdicion = false;

    component.unidadForm.setValue({
      numero_unidad: '101',
      tipo_unidad: 'Depto',
      metraje: 50,
      precio_venta: 100000000,
      estado: 'Disponible',
      proyecto_id: '1',
      cliente_id: '1'
    });

    unidadService.crearUnidad.and.returnValue(of({}));
    unidadService.getUnidades.and.returnValue(of({ data: [] }));

    component.crearUnidad();

    expect(unidadService.crearUnidad).toHaveBeenCalled();
    expect(unidadService.getUnidades).toHaveBeenCalled();
  });

  it('debería editar una unidad cuando está en modo edición', () => {
    component.modoEdicion = true;
    component.unidadSeleccionada = { id: '10' };

    component.unidadForm.setValue({
      numero_unidad: '102',
      tipo_unidad: 'Casa',
      metraje: 70,
      precio_venta: 150000000,
      estado: 'Vendido',
      proyecto_id: '2',
      cliente_id: '2'
    });

    unidadService.editarUnidad.and.returnValue(of({}));
    unidadService.getUnidades.and.returnValue(of({ data: [] }));

    component.crearUnidad();

    expect(unidadService.editarUnidad).toHaveBeenCalledWith('10', jasmine.any(Object));
  });

  it('editarUnidad debe activar modo edición y cargar los valores en el formulario', () => {
    const unidad = {
      id: '20',
      numero_unidad: '301',
      tipo_unidad: 'Oficina',
      metraje: 100,
      precio_venta: 200000000,
      estado: 'Disponible',
      proyecto_id: '3',
      cliente_id: '5'
    };

    component.editarUnidad(unidad);

    expect(component.modoEdicion).toBeTrue();
    expect(component.unidadSeleccionada).toEqual(unidad);
    expect(component.unidadForm.value.numero_unidad).toBe('301');
  });

  it('debería eliminar una unidad correctamente', () => {
    unidadService.eliminarUnidad.and.returnValue(of({}));
    unidadService.getUnidades.and.returnValue(of({ data: [] }));

    const unidad = { id: '10' };

    component.eliminarUnidad(unidad);

    expect(unidadService.eliminarUnidad).toHaveBeenCalledWith('10');
  });

  it('getProyectoNombre debe devolver nombre según ID', () => {
    expect(component.getProyectoNombre('1')).toBe('Proyecto X');
  });

  it('getClienteRut debe devolver rut según ID', () => {
    expect(component.getClienteRut('1')).toBe('11.111.111-1');
  });
});
