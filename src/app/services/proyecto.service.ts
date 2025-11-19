import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  private apiUrl = 'http://localhost:8000/api/proyectos';
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

  getProyectos(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error al obtener proyectos:', error);
        return throwError(error);
      })
    );
  }

  getProyecto(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error al obtener proyecto:', error);
        return throwError(error);
      })
    );
  }

  crearProyecto(proyecto: any): Observable<any> {
    return this.http.post(this.apiUrl, proyecto, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error al crear proyecto:', error);
        return throwError(error);
      })
    );
  }

  editarProyecto(id: string, proyecto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, proyecto, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error al editar proyecto:', error);
        return throwError(error);
      })
    );
  }

  eliminarProyecto(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error al eliminar proyecto:', error);
        return throwError(error);
      })
    );
  }
}