// src/app/services/contrato.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Contrato {
  id: number;
  cliente_id: string;
  unidad_id: string;
  fecha_inicio: string;
  fecha_fin: string;
  monto_total: number;
  tipo_contrato: string;
  estado: string;

  cliente?: any;
  unidad?: any;
  pagos?: any[];
  calificacion?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ContratoService {

  private base = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  /** Método para obtener el token almacenado */
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


  getContratos(): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(`${this.base}/contratos`, this.getAuthHeaders());
  }

  getContrato(id: number): Observable<Contrato> {
    return this.http.get<Contrato>(`${this.base}/contratos/${id}`, this.getAuthHeaders());
  }

  createContrato(contrato: Partial<Contrato>): Observable<Contrato> {
    return this.http.post<Contrato>(`${this.base}/contratos`, contrato, this.getAuthHeaders());
  }

  updateContrato(id: number, contrato: Partial<Contrato>): Observable<Contrato> {
    return this.http.put<Contrato>(`${this.base}/contratos/${id}`, contrato, this.getAuthHeaders());
  }

  deleteContrato(id: number): Observable<any> {
    return this.http.delete(`${this.base}/contratos/${id}`, this.getAuthHeaders());
  }
}
