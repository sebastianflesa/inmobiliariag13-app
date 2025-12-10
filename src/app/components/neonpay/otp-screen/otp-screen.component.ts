import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp-screen',
  templateUrl: './otp-screen.component.html',
  styleUrls: ['./otp-screen.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class OtpScreenComponent implements OnDestroy {
  @Input() sessionId!: number;
  @Output() otpValidated = new EventEmitter<'approved' | 'rejected'>();
  
  otp = '';
  loading = false;
  generated = false;
  timeRemaining = 0; // Variable para el timer
  generatedOtp = ''; // Para mostrar el OTP en pantalla
  
  private timerInterval: any;

  constructor(private http: HttpClient) { }

  generarOtp() {
    if (!this.sessionId) return;
    
    this.loading = true;
    this.otp = ''; // Limpiar input anterior
    
    this.http.post<any>(`http://127.0.0.1:8000/api/pagos/${this.sessionId}/otp`, {})
      .subscribe({
        next: res => {
          this.loading = false;
          this.generated = true;
          this.generatedOtp = res?.otp || ''; // Guardar OTP para mostrar
          this.timeRemaining = res?.expires_in ?? 20; // Usar expires_in del backend
          
          // Iniciar contador
          this.startTimer();
          
          console.log('OTP generado:', this.generatedOtp);
        },
        error: err => {
          this.loading = false;
          alert('Error al generar OTP. Intenta nuevamente.');
          console.error('Error generar OTP', err);
        }
      });
  }

  validarOtp() {
    const cleanOtp = this.otp.replace(/\s+/g, '');
    if (cleanOtp.length !== 6) {
      alert('Debes ingresar los 6 dígitos');
      return;
    }
    
    if (this.timeRemaining <= 0) {
      alert('El código ha expirado. Solicita uno nuevo.');
      return;
    }

    this.loading = true;
    
    this.http.post<any>(`http://127.0.0.1:8000/api/pagos/${this.sessionId}/otp/validar`, {
      otp: cleanOtp
    }).subscribe({
      next: res => {
        this.loading = false;
        this.stopTimer();
        
        if (res?.status === 'success' || res?.status === 'ok') {
          this.otpValidated.emit('approved');
        } else {
          this.otpValidated.emit('rejected');
        }
      },
      error: err => {
        this.loading = false;
        this.stopTimer();
        console.error('Error validar OTP', err);
        this.otpValidated.emit('rejected');
      }
    });
  }

  private startTimer() {
    this.stopTimer(); // Limpiar timer anterior si existe
    
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      
      if (this.timeRemaining <= 0) {
        this.stopTimer();
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }
}