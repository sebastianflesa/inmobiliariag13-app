import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Cliente, ClienteService } from './cliente.service';

describe('ClienteService', () => {
  let service: ClienteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Mock localStorage
    spyOn(localStorage, 'getItem').and.callFake((key: string) => key === 'token' ? 'fake-token' : null);
    spyOn(localStorage, 'setItem');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }]
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

  it('debería poder setear token', () => {
    service.setToken('nuevo-token');
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'nuevo-token');
  });

  // ==== GET CLIENTES ====
  it('debería obtener clientes', () => {
    const clientes: Cliente[] = [{ rut: '12345678-5', nombre: 'Juan', apellido: 'Pérez', email: 'juan@example.com', telefono: '912345678' }];
    service.getClientes().subscribe(res => expect(res).toEqual(clientes));

    const req = httpMock.expectOne('http://localhost:8000/api/clientes');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    req.flush(clientes);
  });

  it('debería manejar error al obtener clientes', () => {
    service.getClientes().subscribe({
      next: () => fail('debería fallar'),
      error: (err) => expect(err.status).toBe(500)
    });

    const req = httpMock.expectOne('http://localhost:8000/api/clientes');
    req.flush({ message: 'Error' }, { status: 500, statusText: 'Server Error' });
  });

  // ==== GET CLIENTE ====
  it('debería obtener un cliente', () => {
    const cliente: Cliente = { rut: '12345678-5', nombre: 'Juan', apellido: 'Pérez', email: 'juan@example.com', telefono: '912345678' };
    service.getCliente('12345678-5').subscribe(res => expect(res).toEqual(cliente));

    const req = httpMock.expectOne('http://localhost:8000/api/clientes/12345678-5');
    expect(req.request.method).toBe('GET');
    req.flush(cliente);
  });

  it('debería manejar error al obtener un cliente', () => {
    service.getCliente('12345678-5').subscribe({
      next: () => fail('debería fallar'),
      error: (err) => expect(err.status).toBe(404)
    });

    const req = httpMock.expectOne('http://localhost:8000/api/clientes/12345678-5');
    req.flush({ message: 'No encontrado' }, { status: 404, statusText: 'Not Found' });
  });

  // ==== CREAR CLIENTE ====
  it('debería crear un cliente', () => {
    const cliente: Cliente = { rut: '12345678-5', nombre: 'Juan', apellido: 'Pérez', email: 'juan@example.com', telefono: '912345678' };
    service.crearCliente(cliente).subscribe(res => expect(res).toEqual(cliente));

    const req = httpMock.expectOne('http://localhost:8000/api/clientes');
    expect(req.request.method).toBe('POST');
    req.flush(cliente);
  });

  it('debería manejar error al crear cliente', () => {
    const cliente: Cliente = { rut: '12345678-5', nombre: 'Juan', apellido: 'Pérez', email: 'juan@example.com', telefono: '912345678' };
    service.crearCliente(cliente).subscribe({
      next: () => fail('debería fallar'),
      error: (err) => expect(err.status).toBe(400)
    });

    const req = httpMock.expectOne('http://localhost:8000/api/clientes');
    req.flush({ message: 'Error creación' }, { status: 400, statusText: 'Bad Request' });
  });

  // ==== EDITAR CLIENTE ====
  it('debería editar un cliente', () => {
    const cliente: Cliente = { rut: '12345678-5', nombre: 'Juan', apellido: 'Pérez', email: 'juan@example.com', telefono: '912345678' };
    service.editarCliente('1', cliente).subscribe(res => expect(res).toEqual(cliente));

    const req = httpMock.expectOne('http://localhost:8000/api/clientes/1');
    expect(req.request.method).toBe('PUT');
    req.flush(cliente);
  });

  it('debería manejar error al editar cliente', () => {
    const cliente: Cliente = { rut: '12345678-5', nombre: 'Juan', apellido: 'Pérez', email: 'juan@example.com', telefono: '912345678' };
    service.editarCliente('1', cliente).subscribe({
      next: () => fail('debería fallar'),
      error: (err) => expect(err.status).toBe(500)
    });

    const req = httpMock.expectOne('http://localhost:8000/api/clientes/1');
    req.flush({ message: 'Error' }, { status: 500, statusText: 'Server Error' });
  });

  // ==== ELIMINAR CLIENTE ====
  it('debería eliminar un cliente', () => {
    service.eliminarCliente('1').subscribe(res => expect(res).toEqual({}));

    const req = httpMock.expectOne('http://localhost:8000/api/clientes/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('debería manejar error al eliminar cliente', () => {
    service.eliminarCliente('1').subscribe({
      next: () => fail('debería fallar'),
      error: (err) => expect(err.status).toBe(403)
    });

    const req = httpMock.expectOne('http://localhost:8000/api/clientes/1');
    req.flush({ message: 'No permitido' }, { status: 403, statusText: 'Forbidden' });
  });
});
