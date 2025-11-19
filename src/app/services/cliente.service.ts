import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

export interface Cliente {
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl = 'http://localhost:8000/api/clientes';
  private token: string | null = null;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('token');
    }
  }

  public setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      this.token = token;
      localStorage.setItem('token', token);
    }
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
  }

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      tap(clientes => console.log('Clientes obtenidos:', clientes)),
      catchError(error => {
        console.error('Error al obtener clientes:', error);
        return throwError(error);
      })
    );
  }
  getCliente(rut: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${rut}`, { headers: this.getHeaders() });
  }

  /*
  getClientePorRut(rut: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/buscar-por-rut/${rut}`, { headers: this.getHeaders() });
  }
  */

  crearCliente(cliente: Cliente): Observable<any> {
    return this.http.post(this.apiUrl, cliente, { headers: this.getHeaders() });
  }

  editarCliente(id: string, cliente: Cliente): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, cliente, { headers: this.getHeaders() });
  }

  eliminarCliente(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}