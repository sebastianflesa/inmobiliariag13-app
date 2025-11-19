import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { UnidadService } from './unidad.service';

describe('UnidadService', () => {
  let service: UnidadService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UnidadService]
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

  it('debería obtener unidades', () => {
    const unidades = [{ id: 1, nombre: 'Unidad 1' }];
    service.getUnidades().subscribe(response => {
      expect(response).toEqual(unidades);
    });
    const req = httpMock.expectOne('http://localhost:8000/api/unidades');
    expect(req.request.method).toBe('GET');
    req.flush(unidades);
  });

  it('debería obtener una unidad', () => {
    const unidad = { id: 1, nombre: 'Unidad 1' };
    service.getUnidad('1').subscribe(response => {
      expect(response).toEqual(unidad);
    });
    const req = httpMock.expectOne('http://localhost:8000/api/unidades/1');
    expect(req.request.method).toBe('GET');
    req.flush(unidad);
  });

  it('debería crear una unidad', () => {
    const unidad = { nombre: 'Unidad 1' };
    service.crearUnidad(unidad).subscribe(response => {
      expect(response).toEqual(unidad);
    });
    const req = httpMock.expectOne('http://localhost:8000/api/unidades');
    expect(req.request.method).toBe('POST');
    req.flush(unidad);
  });

  it('debería editar una unidad', () => {
    const unidad = { nombre: 'Unidad 1' };
    service.editarUnidad('1', unidad).subscribe(response => {
      expect(response).toEqual(unidad);
    });
    const req = httpMock.expectOne('http://localhost:8000/api/unidades/1');
    expect(req.request.method).toBe('PUT');
    req.flush(unidad);
  });

  it('debería eliminar una unidad', () => {
    service.eliminarUnidad('1').subscribe(response => {
      expect(response).toBeTruthy();
    });
    const req = httpMock.expectOne('http://localhost:8000/api/unidades/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});