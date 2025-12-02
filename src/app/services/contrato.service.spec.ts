import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Contrato, ContratoService } from './contrato.service';

describe('ContratoService', () => {
  let service: ContratoService;
  let httpMock: HttpTestingController;
  const base = 'http://localhost:8000/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContratoService]
    });

    service = TestBed.inject(ContratoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET all contratos', () => {
    const mockData: Contrato[] = [
      {
        id: 1,
        cliente_id: 'aaa',
        unidad_id: 'u1',
        fecha_inicio: '2025-01-01',
        fecha_fin: '2025-12-31',
        monto_total: 1000,
        tipo_contrato: 'mensual',
        estado: 'activo'
      }
    ];

    service.getContratos().subscribe(resp => {
      expect(resp).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${base}/contratos`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should GET one contrato by ID', () => {
    const mockContrato: Contrato = {
      id: 1,
      cliente_id: 'ccc',
      unidad_id: 'u2',
      fecha_inicio: '2025-02-01',
      fecha_fin: '2025-11-30',
      monto_total: 2000,
      tipo_contrato: 'anual',
      estado: 'activo'
    };

    service.getContrato(1).subscribe(resp => {
      expect(resp).toEqual(mockContrato);
    });

    const req = httpMock.expectOne(`${base}/contratos/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockContrato);
  });

  it('should POST a new contrato', () => {
    const newContrato = {
      cliente_id: 'cli1',
      unidad_id: 'un1',
      monto_total: 5000
    };

    const mockResponse: Contrato = {
      id: 123,
      cliente_id: 'cli1',
      unidad_id: 'un1',
      fecha_inicio: '2025-01-01',
      fecha_fin: '2025-12-01',
      monto_total: 5000,
      tipo_contrato: 'mensual',
      estado: 'activo'
    };

    service.createContrato(newContrato).subscribe(resp => {
      expect(resp).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${base}/contratos`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newContrato);
    req.flush(mockResponse);
  });

  it('should PUT update contrato', () => {
    const updateData = { monto_total: 7777 };

    const mockResponse: Contrato = {
      id: 1,
      cliente_id: 'cliA',
      unidad_id: 'uA',
      fecha_inicio: '2025-01-01',
      fecha_fin: '2025-12-01',
      monto_total: 7777,
      tipo_contrato: 'mensual',
      estado: 'activo'
    };

    service.updateContrato(1, updateData).subscribe(resp => {
      expect(resp.monto_total).toBe(7777);
    });

    const req = httpMock.expectOne(`${base}/contratos/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateData);
    req.flush(mockResponse);
  });

  it('should DELETE a contrato', () => {
    service.deleteContrato(1).subscribe(resp => {
      expect(resp).toEqual({ success: true });
    });

    const req = httpMock.expectOne(`${base}/contratos/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });

  it('should include Authorization header when token exists', () => {
    spyOn(localStorage, 'getItem').and.returnValue('fake-token');

    service.getContratos().subscribe();
    const req = httpMock.expectOne(`${base}/contratos`);

    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    req.flush([]);
  });

  it('should include empty Authorization header when no token exists', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    service.getContratos().subscribe();
    const req = httpMock.expectOne(`${base}/contratos`);

    expect(req.request.headers.get('Authorization')).toBe('Bearer ');
    req.flush([]);
  });
});
