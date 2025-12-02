// src/app/services/calificacion.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Calificacion {
  id: number;
  contrato_id: number;
  cliente_id: string;
  unidad_id?: string;
  proyecto_id?: string;
  puntaje: number;
  comentario?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CalificacionService {

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


  getCalificaciones(): Observable<Calificacion[]> {
    return this.http.get<Calificacion[]>(`${this.base}/calificaciones`, this.getAuthHeaders());
  }

  getCalificacion(id: number): Observable<Calificacion> {
    return this.http.get<Calificacion>(`${this.base}/calificaciones/${id}`, this.getAuthHeaders());
  }

  createCalificacion(data: Partial<Calificacion>): Observable<Calificacion> {
    return this.http.post<Calificacion>(`${this.base}/calificaciones`, data, this.getAuthHeaders());
  }

  updateCalificacion(id: number, data: Partial<Calificacion>): Observable<Calificacion> {
    return this.http.put<Calificacion>(`${this.base}/calificaciones/${id}`, data, this.getAuthHeaders());
  }

  deleteCalificacion(id: number): Observable<any> {
    return this.http.delete(`${this.base}/calificaciones/${id}`, this.getAuthHeaders());
  }

  getByContrato(contratoId: number): Observable<Calificacion[]> {
    return this.http.get<Calificacion[]>(
      `${this.base}/calificaciones?contrato_id=${contratoId}`,
      this.getAuthHeaders()
    );
  }
}
