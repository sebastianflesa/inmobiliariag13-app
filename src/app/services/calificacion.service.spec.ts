import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Calificacion, CalificacionService } from './calificacion.service';

describe('CalificacionService', () => {
  let service: CalificacionService;
  let httpMock: HttpTestingController;

  const api = 'http://localhost:8000/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CalificacionService);
    httpMock = TestBed.inject(HttpTestingController);

    spyOn(localStorage, 'getItem').and.returnValue('fake-token');
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener todas las calificaciones', () => {
    const mock: Calificacion[] = [
      { id: 1, contrato_id: 10, cliente_id: 'c1', puntaje: 5 }
    ];

    service.getCalificaciones().subscribe(res => {
      expect(res).toEqual(mock);
    });

    const req = httpMock.expectOne(`${api}/calificaciones`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('debería obtener una calificación por ID', () => {
    const mock: Calificacion = { id: 1, contrato_id: 10, cliente_id: 'c1', puntaje: 4 };

    service.getCalificacion(1).subscribe(res => {
      expect(res).toEqual(mock);
    });

    const req = httpMock.expectOne(`${api}/calificaciones/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('debería crear una calificación', () => {
    const payload = { puntaje: 5 };
    const mock: Calificacion = { id: 1, contrato_id: 10, cliente_id: 'c1', puntaje: 5 };

    service.createCalificacion(payload).subscribe(res => {
      expect(res).toEqual(mock);
    });

    const req = httpMock.expectOne(`${api}/calificaciones`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mock);
  });

  it('debería actualizar una calificación', () => {
    const payload = { puntaje: 3 };
    const mock: Calificacion = { id: 1, contrato_id: 10, cliente_id: 'c1', puntaje: 3 };

    service.updateCalificacion(1, payload).subscribe(res => {
      expect(res).toEqual(mock);
    });

    const req = httpMock.expectOne(`${api}/calificaciones/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(mock);
  });

  it('debería eliminar una calificación', () => {
    service.deleteCalificacion(1).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${api}/calificaciones/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });

  it('debería obtener calificaciones por contrato_id', () => {
    const mock: Calificacion[] = [
      { id: 1, contrato_id: 10, cliente_id: 'c1', puntaje: 5 }
    ];

    service.getByContrato(10).subscribe(res => {
      expect(res).toEqual(mock);
    });

    const req = httpMock.expectOne(`${api}/calificaciones?contrato_id=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });
});
