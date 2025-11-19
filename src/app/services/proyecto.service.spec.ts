import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ProyectoService } from './proyecto.service';

describe('ProyectoService', () => {
  let service: ProyectoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
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

  it('debería obtener proyectos', () => {
    const proyectos = [{ id: 1, nombre: 'Proyecto 1' }];
    service.getProyectos().subscribe(response => {
      expect(response).toEqual(proyectos);
    });
    const req = httpMock.expectOne('http://localhost:8000/api/proyectos');
    expect(req.request.method).toBe('GET');
    req.flush(proyectos);
  });

  it('debería obtener un proyecto', () => {
    const proyecto = { id: 1, nombre: 'Proyecto 1' };
    service.getProyecto('1').subscribe(response => {
      expect(response).toEqual(proyecto);
    });
    const req = httpMock.expectOne('http://localhost:8000/api/proyectos/1');
    expect(req.request.method).toBe('GET');
    req.flush(proyecto);
  });

  it('debería crear un proyecto', () => {
    const proyecto = { nombre: 'Proyecto 1' };
    service.crearProyecto(proyecto).subscribe(response => {
      expect(response).toEqual(proyecto);
    });
    const req = httpMock.expectOne('http://localhost:8000/api/proyectos');
    expect(req.request.method).toBe('POST');
    req.flush(proyecto);
  });

  it('debería editar un proyecto', () => {
    const proyecto = { nombre: 'Proyecto 1' };
    service.editarProyecto('1', proyecto).subscribe(response => {
      expect(response).toEqual(proyecto);
    });
    const req = httpMock.expectOne('http://localhost:8000/api/proyectos/1');
    expect(req.request.method).toBe('PUT');
    req.flush(proyecto);
  });

  it('debería eliminar un proyecto', () => {
    service.eliminarProyecto('1').subscribe(response => {
      expect(response).toBeTruthy();
    });
    const req = httpMock.expectOne('http://localhost:8000/api/proyectos/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});