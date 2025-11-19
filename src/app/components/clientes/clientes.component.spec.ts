import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ClienteService } from '../../services/cliente.service';

import { ClientesComponent } from './clientes.component';

describe('ClientesComponent', () => {
  let component: ClientesComponent;
  let fixture: ComponentFixture<ClientesComponent>;
  let clienteServiceSpy: any;

  beforeEach(async () => {
    clienteServiceSpy = jasmine.createSpyObj('ClienteService', ['getClientes', 'crearCliente', 'editarCliente', 'eliminarCliente']);
    clienteServiceSpy.getClientes.and.returnValue(of({ data: [] }));

    await TestBed.configureTestingModule({
      imports: [ClientesComponent, HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        { provide: ClienteService, useValue: clienteServiceSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener un formulario inválido cuando está vacío', () => {
    expect(component.clienteForm.valid).toBeFalsy();
  });

  it('debería tener un formulario válido cuando se llenan todos los campos correctamente', () => {
    component.clienteForm.setValue({
      rut: '12345678-5',
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@example.com',
      telefono: '912345678'
    });
    expect(component.clienteForm.valid).toBeTruthy();
  });

  it('debería mostrar el formulario cuando se llama a mostrarFormularioCrear', () => {
    component.mostrarFormularioCrear();
    expect(component.mostrarFormulario).toBeTruthy();
  });

  it('debería crear un cliente correctamente', () => {
    clienteServiceSpy.crearCliente.and.returnValue(of({}));
    component.clienteForm.setValue({
      rut: '12345678-5',
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@example.com',
      telefono: '912345678'
    });
    component.crearCliente();
    expect(clienteServiceSpy.crearCliente).toHaveBeenCalledTimes(1);
  });

  it('debería editar un cliente correctamente', () => {
    const cliente = {
      id: 1,
      rut: '12345678-5',
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@example.com',
      telefono: '912345678'
    };
    component.editarCliente(cliente);
    expect(component.modoEdicion).toBeTruthy();
    expect(component.clienteSeleccionado).toEqual(cliente);
  });

  it('debería eliminar un cliente correctamente', () => {
    clienteServiceSpy.eliminarCliente.and.returnValue(of({}));
    const cliente = {
      id: 1,
      rut: '12345678-5',
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@example.com',
      telefono: '912345678'
    };
    component.eliminarCliente(cliente);
    expect(clienteServiceSpy.eliminarCliente).toHaveBeenCalledTimes(1);
  });
});