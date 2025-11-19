import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UnidadService {

  private apiUrl = 'http://localhost:8000/api/unidades';
  private token: string | null = null;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('token');
    }
  }

  private getHeaders(): HttpHeaders {
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('token');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
  }

  getUnidades(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error al obtener unidades:', error);
        return throwError(error);
      })
    );
  }

  getUnidad(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error al obtener unidad:', error);
        return throwError(error);
      })
    );
  }

  crearUnidad(unidad: any): Observable<any> {
    return this.http.post(this.apiUrl, unidad, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error al crear unidad:', error);
        return throwError(error);
      })
    );
  }

  editarUnidad(id: string, unidad: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, unidad, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error al editar unidad:', error);
        return throwError(error);
      })
    );
  }

  eliminarUnidad(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error al eliminar unidad:', error);
        return throwError(error);
      })
    );
  }
}