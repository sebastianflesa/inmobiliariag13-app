// src/app/services/pago.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Pago {
  id: number;
  contrato_id: number;
  monto: number;
  fecha_pago: string;
  metodo_pago: string;
  estado: string;
  contrato?: any;
}

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  private base = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  /** Método para obtener token */
  /** Método para obtener el token almacenado */
  private getAuthHeaders() {

    // Si estamos en SSR (Node), no existe window ni localStorage
    if (typeof window === 'undefined') {
      return {
        headers: new HttpHeaders({
          'Accept': 'application/json'
        })
      };
    }

    const token = localStorage.getItem('token') || '';

    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      })
    };
  }


  getPagos(): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.base}/pagos`, this.getAuthHeaders());
  }

  getPago(id: number): Observable<Pago> {
    return this.http.get<Pago>(`${this.base}/pagos/${id}`, this.getAuthHeaders());
  }

  createPago(pago: Partial<Pago>): Observable<Pago> {
    return this.http.post<Pago>(`${this.base}/pagos`, pago, this.getAuthHeaders());
  }

  updatePago(id: number, pago: Partial<Pago>): Observable<Pago> {
    return this.http.put<Pago>(`${this.base}/pagos/${id}`, pago, this.getAuthHeaders());
  }

  deletePago(id: number): Observable<any> {
    return this.http.delete(`${this.base}/pagos/${id}`, this.getAuthHeaders());
  }

  getPagosByContrato(contratoId: number): Observable<Pago[]> {
    return this.http.get<Pago[]>(
      `${this.base}/pagos?contrato_id=${contratoId}`,
      this.getAuthHeaders()
    );
  }
}
