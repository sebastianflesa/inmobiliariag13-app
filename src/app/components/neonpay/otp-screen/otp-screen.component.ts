import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp-screen',
  templateUrl: './otp-screen.component.html',
  styleUrls: ['./otp-screen.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class OtpScreenComponent {

  @Input() sessionId!: number; // paymentId
  @Output() otpValidated = new EventEmitter<'approved' | 'rejected'>();

  otp = '';
  loading = false;
  generated = false;
  expiresIn = 0;

  constructor(private http: HttpClient) { }

  generarOtp() {
    if (!this.sessionId) return;
    this.loading = true;

    this.http.post<any>(`http://127.0.0.1:8000/api/pagos/${this.sessionId}/otp`, {})
      .subscribe({
        next: res => {
          this.loading = false;
          this.generated = true;
          this.expiresIn = res?.expires_in ?? 20;
          // opcional: mostrar res.otp (formateado) en consola para debug
          console.log('OTP generado:', res?.otp);
        },
        error: err => {
          this.loading = false;
          console.error('Error generar OTP', err);
        }
      });
  }

  validarOtp() {
    if (this.otp.replace(/\s+/g, '').length < 6) return;

    this.loading = true;

    this.http.post<any>(`http://127.0.0.1:8000/api/pagos/${this.sessionId}/otp/validar`, {
      otp: this.otp
    }).subscribe({
      next: res => {
        this.loading = false;
        // backend devuelve { status: 'success', message: 'Pago autorizado', pago: {...} }
        if (res?.status === 'success' || res?.status === 'ok') {
          this.otpValidated.emit('approved');
        } else {
          this.otpValidated.emit('rejected');
        }
      },
      error: err => {
        this.loading = false;
        this.otpValidated.emit('rejected');
      }
    });
  }
}
