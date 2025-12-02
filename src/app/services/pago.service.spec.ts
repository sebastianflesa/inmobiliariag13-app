import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Pago, PagoService } from './pago.service';

describe('PagoService', () => {
  let service: PagoService;
  let httpMock: HttpTestingController;
  const base = 'http://localhost:8000/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PagoService]
    });

    service = TestBed.inject(PagoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET all pagos', () => {
    const mockData: Pago[] = [
      {
        id: 1,
        contrato_id: 10,
        monto: 20000,
        fecha_pago: '2025-01-01',
        metodo_pago: 'transferencia',
        estado: 'pendiente'
      }
    ];

    service.getPagos().subscribe(resp => {
      expect(resp).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${base}/pagos`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should GET pago by ID', () => {
    const mockPago: Pago = {
      id: 1,
      contrato_id: 10,
      monto: 10000,
      fecha_pago: '2025-01-15',
      metodo_pago: 'tarjeta',
      estado: 'pagado'
    };

    service.getPago(1).subscribe(resp => {
      expect(resp).toEqual(mockPago);
    });

    const req = httpMock.expectOne(`${base}/pagos/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPago);
  });

  it('should POST create pago', () => {
    const newPago = {
      contrato_id: 10,
      monto: 5000
    };

    const mockResponse: Pago = {
      id: 99,
      contrato_id: 10,
      monto: 5000,
      fecha_pago: '2025-01-10',
      metodo_pago: 'transferencia',
      estado: 'pendiente'
    };

    service.createPago(newPago).subscribe(resp => {
      expect(resp).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${base}/pagos`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPago);
    req.flush(mockResponse);
  });

  it('should PUT update pago', () => {
    const updateData = { monto: 9999 };

    const mockResponse: Pago = {
      id: 1,
      contrato_id: 10,
      monto: 9999,
      fecha_pago: '2025-02-02',
      metodo_pago: 'tarjeta',
      estado: 'pagado'
    };

    service.updatePago(1, updateData).subscribe(resp => {
      expect(resp.monto).toBe(9999);
    });

    const req = httpMock.expectOne(`${base}/pagos/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateData);
    req.flush(mockResponse);
  });

  it('should DELETE pago', () => {
    service.deletePago(1).subscribe(resp => {
      expect(resp).toEqual({ success: true });
    });

    const req = httpMock.expectOne(`${base}/pagos/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });

  it('should GET pagos by contrato_id', () => {
    const mockData: Pago[] = [
      {
        id: 1,
        contrato_id: 20,
        monto: 3000,
        fecha_pago: '2025-03-10',
        metodo_pago: 'transferencia',
        estado: 'pendiente'
      }
    ];

    service.getPagosByContrato(20).subscribe(resp => {
      expect(resp.length).toBe(1);
      expect(resp[0].contrato_id).toBe(20);
    });

    const req = httpMock.expectOne(`${base}/pagos?contrato_id=20`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should include Authorization header when token exists', () => {
    spyOn(localStorage, 'getItem').and.returnValue('fake-token');

    service.getPagos().subscribe();
    const req = httpMock.expectOne(`${base}/pagos`);

    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    req.flush([]);
  });

  it('should include empty Authorization header when token is missing', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    service.getPagos().subscribe();
    const req = httpMock.expectOne(`${base}/pagos`);

    expect(req.request.headers.get('Authorization')).toBe('Bearer ');
    req.flush([]);
  });
});
