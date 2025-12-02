// src/app/services/neonpay.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NeonPayService {

    private base = 'http://localhost:8000/api';

    constructor(private http: HttpClient) { }

    iniciarPago(contratoId: number, body: any): Observable<any> {
        return this.http.post(`${this.base}/pagos/${contratoId}/init`, body);
    }

    validarPin(pagoId: number, pin: string): Observable<any> {
        return this.http.post(`${this.base}/pagos/${pagoId}/pin`, { pin });
    }

    generarOtp(pagoId: number): Observable<any> {
        return this.http.post(`${this.base}/pagos/${pagoId}/otp`, {});
    }

    validarOtp(pagoId: number, otp: string): Observable<any> {
        return this.http.post(`${this.base}/pagos/${pagoId}/otp/validar`, { otp });
    }
}
