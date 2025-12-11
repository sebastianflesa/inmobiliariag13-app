import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private apiUrl = 'http://98.94.165.186:8000/api';

    constructor(private http: HttpClient) { }

    getProyectos() {
        return this.http.get(`${this.apiUrl}/proyectos`);
    }
}