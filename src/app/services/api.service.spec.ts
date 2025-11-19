import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ApiService);
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
});