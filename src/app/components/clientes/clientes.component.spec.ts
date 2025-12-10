import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ClienteService } from '../../services/cliente.service';
import { ClientesComponent } from './clientes.component';

describe('ClientesComponent', () => {
  let component: ClientesComponent;
  let fixture: ComponentFixture<ClientesComponent>;
  let clienteServiceSpy: any;

  const mockCliente = {
    id: 1,
    rut: '11111111-1',
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'test@test.cl',
    telefono: '999999999'
  };

  const mockClienteFormValues = {
    rut: mockCliente.rut,
    nombre: mockCliente.nombre,
    apellido: mockCliente.apellido,
    email: mockCliente.email,
    telefono: mockCliente.telefono
  };

  beforeEach(async () => {
    clienteServiceSpy = jasmine.createSpyObj('ClienteService', [
      'getClientes',
      'crearCliente',
      'editarCliente',
      'eliminarCliente'
    ]);

    clienteServiceSpy.getClientes.and.returnValue(of({ data: [] }));
    clienteServiceSpy.crearCliente.and.returnValue(of({}));
    clienteServiceSpy.editarCliente.and.returnValue(of({}));
    clienteServiceSpy.eliminarCliente.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [
        ClientesComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule
      ],
      providers: [{ provide: ClienteService, useValue: clienteServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load clientes on init', () => {
    expect(clienteServiceSpy.getClientes).toHaveBeenCalled();
    expect(component.clientes).toEqual([]);
  });

  it('should handle error when loading clientes', () => {
    clienteServiceSpy.getClientes.and.returnValue(
      throwError(() => new Error('fail'))
    );

    component.ngOnInit();

    expect(component.clientes).toEqual([]);
  });

  it('should show form for creating new cliente', () => {
    component.mostrarFormularioCrear();
    expect(component.mostrarFormulario).toBeTrue();
    expect(component.modoEdicion).toBeFalse();
  });

  it('should create cliente when form valid', () => {
    component.clienteForm.setValue(mockClienteFormValues);

    component.crearCliente();

    expect(clienteServiceSpy.crearCliente).toHaveBeenCalled();
  });

  it('should NOT create cliente when form invalid', () => {
    component.clienteForm.patchValue({ nombre: '' });

    component.crearCliente();

    expect(clienteServiceSpy.crearCliente).not.toHaveBeenCalled();
  });

  it('should handle error when creating cliente', () => {
    clienteServiceSpy.crearCliente.and.returnValue(
      throwError(() => ({ error: { message: 'error' } }))
    );

    component.clienteForm.setValue(mockClienteFormValues);

    component.crearCliente();

    expect(component.clienteCreado).toBeFalse();
  });

  it('should edit existing cliente', () => {
    component.editarCliente(1, mockCliente);

    expect(component.mostrarFormulario).toBeTrue();
    expect(component.modoEdicion).toBeTrue();
    expect(component.clienteForm.value.rut).toBe(mockCliente.rut);
  });

  it('should update cliente in edit mode', () => {
    component.modoEdicion = true;
    component.clienteSeleccionado = mockCliente;

    component.clienteForm.setValue(mockClienteFormValues);

    component.crearCliente();

    expect(clienteServiceSpy.editarCliente)
      .toHaveBeenCalledWith(1, mockClienteFormValues);
  });

  it('should delete cliente', () => {
    component.eliminarCliente({ id: 1 });

    expect(clienteServiceSpy.eliminarCliente).toHaveBeenCalledWith(1);
  });

  it('should handle error on delete', () => {
    clienteServiceSpy.eliminarCliente.and.returnValue(
      throwError(() => new Error('fail'))
    );

    spyOn(console, 'error');

    component.eliminarCliente({ id: 1 });

    expect(console.error).toHaveBeenCalled();
  });


  it('rut validator should return required when empty', () => {
    const ctrl = { value: '' } as any;
    const result = (component as any).clienteForm.controls['rut'].validator(ctrl);
    expect(result).toEqual({ required: true });
  });

  it('rut validator should return formatoInvalido when format wrong', () => {
    const ctrl = { value: 'abc' } as any;
    const result = (component as any).clienteForm.controls['rut'].validator(ctrl);
    expect(result).toEqual({ formatoInvalido: true });
  });

  it('rut validator should return null for valid RUT', () => {
    const ctrl = { value: '11111111-1' } as any;
    const result = (component as any).clienteForm.controls['rut'].validator(ctrl);
    expect(result).toBeNull();
  });

  it('rut validator should return rutInvalido when DV incorrecto', () => {
    const ctrl = { value: '11111111-9' } as any;
    const result = (component as any).clienteForm.controls['rut'].validator(ctrl);
    expect(result).toEqual({ rutInvalido: true });
  });
});
