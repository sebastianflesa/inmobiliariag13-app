import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UnidadService } from './unidad.service';

describe('UnidadService', () => {
  let service: UnidadService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Mock localStorage
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'token') return 'fake-token';
      return null;
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(UnidadService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ==== GET UNIDADES ====
  it('debería obtener unidades', () => {
    const unidades = [{ id: 1, nombre: 'Unidad 1' }];
    service.getUnidades().subscribe(res => expect(res).toEqual(unidades));

    const req = httpMock.expectOne('http://localhost:8000/api/unidades');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    req.flush(unidades);
  });

  it('debería manejar error al obtener unidades', () => {
    service.getUnidades().subscribe({
      next: () => fail('debería fallar'),
      error: (err) => expect(err.status).toBe(500)
    });

    const req = httpMock.expectOne('http://localhost:8000/api/unidades');
    req.flush({ message: 'Error' }, { status: 500, statusText: 'Server Error' });
  });

  // ==== GET UNIDAD ====
  it('debería obtener una unidad', () => {
    const unidad = { id: 1, nombre: 'Unidad 1' };
    service.getUnidad('1').subscribe(res => expect(res).toEqual(unidad));

    const req = httpMock.expectOne('http://localhost:8000/api/unidades/1');
    expect(req.request.method).toBe('GET');
    req.flush(unidad);
  });

  it('debería manejar error al obtener una unidad', () => {
    service.getUnidad('1').subscribe({
      next: () => fail('debería fallar'),
      error: (err) => expect(err.status).toBe(404)
    });

    const req = httpMock.expectOne('http://localhost:8000/api/unidades/1');
    req.flush({ message: 'No encontrado' }, { status: 404, statusText: 'Not Found' });
  });

  // ==== CREAR UNIDAD ====
  it('debería crear una unidad', () => {
    const unidad = { nombre: 'Unidad 1' };
    service.crearUnidad(unidad).subscribe(res => expect(res).toEqual(unidad));

    const req = httpMock.expectOne('http://localhost:8000/api/unidades');
    expect(req.request.method).toBe('POST');
    req.flush(unidad);
  });

  it('debería manejar error al crear unidad', () => {
    const unidad = { nombre: 'Unidad 1' };
    service.crearUnidad(unidad).subscribe({
      next: () => fail('debería fallar'),
      error: (err) => expect(err.status).toBe(400)
    });

    const req = httpMock.expectOne('http://localhost:8000/api/unidades');
    req.flush({ message: 'Error creación' }, { status: 400, statusText: 'Bad Request' });
  });

  // ==== EDITAR UNIDAD ====
  it('debería editar una unidad', () => {
    const unidad = { nombre: 'Unidad Editada' };
    service.editarUnidad('1', unidad).subscribe(res => expect(res).toEqual(unidad));

    const req = httpMock.expectOne('http://localhost:8000/api/unidades/1');
    expect(req.request.method).toBe('PUT');
    req.flush(unidad);
  });

  it('debería manejar error al editar unidad', () => {
    const unidad = { nombre: 'Unidad Editada' };
    service.editarUnidad('1', unidad).subscribe({
      next: () => fail('debería fallar'),
      error: (err) => expect(err.status).toBe(500)
    });

    const req = httpMock.expectOne('http://localhost:8000/api/unidades/1');
    req.flush({ message: 'Error' }, { status: 500, statusText: 'Server Error' });
  });

  // ==== ELIMINAR UNIDAD ====
  it('debería eliminar una unidad', () => {
    service.eliminarUnidad('1').subscribe(res => expect(res).toEqual({}));

    const req = httpMock.expectOne('http://localhost:8000/api/unidades/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('debería manejar error al eliminar unidad', () => {
    service.eliminarUnidad('1').subscribe({
      next: () => fail('debería fallar'),
      error: (err) => expect(err.status).toBe(403)
    });

    const req = httpMock.expectOne('http://localhost:8000/api/unidades/1');
    req.flush({ message: 'No permitido' }, { status: 403, statusText: 'Forbidden' });
  });
});
