import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ProyectoService } from './proyecto.service';

describe('ProyectoService', () => {
  let service: ProyectoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Mock para localStorage
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
    service = TestBed.inject(ProyectoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ==== GET PROYECTOS ====
  it('debería obtener proyectos', () => {
    const proyectos = [{ id: 1, nombre: 'Proyecto 1' }];
    service.getProyectos().subscribe(res => expect(res).toEqual(proyectos));

    const req = httpMock.expectOne('http://localhost:8000/api/proyectos');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    req.flush(proyectos);
  });

  it('debería manejar error al obtener proyectos', () => {
    service.getProyectos().subscribe({
      next: () => fail('debería fallar'),
      error: (err) => expect(err.status).toBe(500)
    });

    const req = httpMock.expectOne('http://localhost:8000/api/proyectos');
    req.flush({ message: 'Error' }, { status: 500, statusText: 'Server Error' });
  });

  // ==== GET PROYECTO ====
  it('debería obtener un proyecto', () => {
    const proyecto = { id: 1, nombre: 'Proyecto 1' };
    service.getProyecto('1').subscribe(res => expect(res).toEqual(proyecto));

    const req = httpMock.expectOne('http://localhost:8000/api/proyectos/1');
    expect(req.request.method).toBe('GET');
    req.flush(proyecto);
  });

  it('debería manejar error al obtener un proyecto', () => {
    service.getProyecto('1').subscribe({
      next: () => fail('debería fallar'),
      error: (err) => expect(err.status).toBe(404)
    });

    const req = httpMock.expectOne('http://localhost:8000/api/proyectos/1');
    req.flush({ message: 'No encontrado' }, { status: 404, statusText: 'Not Found' });
  });

  // ==== CREAR PROYECTO ====
  it('debería crear un proyecto', () => {
    const proyecto = { nombre: 'Proyecto 1' };
    service.crearProyecto(proyecto).subscribe(res => expect(res).toEqual(proyecto));

    const req = httpMock.expectOne('http://localhost:8000/api/proyectos');
    expect(req.request.method).toBe('POST');
    req.flush(proyecto);
  });

  it('debería manejar error al crear proyecto', () => {
    const proyecto = { nombre: 'Proyecto 1' };
    service.crearProyecto(proyecto).subscribe({
      next: () => fail('debería fallar'),
      error: (err) => expect(err.status).toBe(400)
    });

    const req = httpMock.expectOne('http://localhost:8000/api/proyectos');
    req.flush({ message: 'Error creación' }, { status: 400, statusText: 'Bad Request' });
  });

  // ==== EDITAR PROYECTO ====
  it('debería editar un proyecto', () => {
    const proyecto = { nombre: 'Proyecto Editado' };
    service.editarProyecto('1', proyecto).subscribe(res => expect(res).toEqual(proyecto));

    const req = httpMock.expectOne('http://localhost:8000/api/proyectos/1');
    expect(req.request.method).toBe('PUT');
    req.flush(proyecto);
  });

  it('debería manejar error al editar proyecto', () => {
    const proyecto = { nombre: 'Proyecto Editado' };
    service.editarProyecto('1', proyecto).subscribe({
      next: () => fail('debería fallar'),
      error: (err) => expect(err.status).toBe(500)
    });

    const req = httpMock.expectOne('http://localhost:8000/api/proyectos/1');
    req.flush({ message: 'Error' }, { status: 500, statusText: 'Server Error' });
  });

  // ==== ELIMINAR PROYECTO ====
  it('debería eliminar un proyecto', () => {
    service.eliminarProyecto('1').subscribe(res => expect(res).toEqual({}));

    const req = httpMock.expectOne('http://localhost:8000/api/proyectos/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('debería manejar error al eliminar proyecto', () => {
    service.eliminarProyecto('1').subscribe({
      next: () => fail('debería fallar'),
      error: (err) => expect(err.status).toBe(403)
    });

    const req = httpMock.expectOne('http://localhost:8000/api/proyectos/1');
    req.flush({ message: 'No permitido' }, { status: 403, statusText: 'Forbidden' });
  });
});
