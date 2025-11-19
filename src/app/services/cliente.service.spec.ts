import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ClienteService } from './cliente.service';

describe('ClienteService', () => {
  let service: ClienteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ClienteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener clientes', () => {
    const clientes = [{ rut: '12345678-5', nombre: 'Juan', apellido: 'Pérez', email: 'juan@example.com', telefono: '912345678' }];
    service.getClientes().subscribe(response => {
      expect(response).toEqual(clientes);
    });
    const req = httpMock.expectOne('http://localhost:8000/api/clientes');
    expect(req.request.method).toBe('GET');
    req.flush(clientes);
  });

  it('debería obtener un cliente', () => {
    const cliente = { rut: '12345678-5', nombre: 'Juan', apellido: 'Pérez', email: 'juan@example.com', telefono: '912345678' };
    service.getCliente('12345678-5').subscribe(response => {
      expect(response).toEqual(cliente);
    });
    const req = httpMock.expectOne('http://localhost:8000/api/clientes/12345678-5');
    expect(req.request.method).toBe('GET');
    req.flush(cliente);
  });

  it('debería crear un cliente', () => {
    const cliente = { rut: '12345678-5', nombre: 'Juan', apellido: 'Pérez', email: 'juan@example.com', telefono: '912345678' };
    service.crearCliente(cliente).subscribe(response => {
      expect(response).toEqual(cliente);
    });
    const req = httpMock.expectOne('http://localhost:8000/api/clientes');
    expect(req.request.method).toBe('POST');
    req.flush(cliente);
  });

  it('debería editar un cliente', () => {
    const cliente = { rut: '12345678-5', nombre: 'Juan', apellido: 'Pérez', email: 'juan@example.com', telefono: '912345678' };
    service.editarCliente('1', cliente).subscribe(response => {
      expect(response).toEqual(cliente);
    });
    const req = httpMock.expectOne('http://localhost:8000/api/clientes/1');
    expect(req.request.method).toBe('PUT');
    req.flush(cliente);
  });

  it('debería eliminar un cliente', () => {
    service.eliminarCliente('1').subscribe(response => {
      expect(response).toBeTruthy();
    });
    const req = httpMock.expectOne('http://localhost:8000/api/clientes/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});