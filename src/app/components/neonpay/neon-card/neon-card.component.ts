import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-neon-card',
  standalone: true,
  templateUrl: './neon-card.component.html',
  styleUrls: ['./neon-card.component.css']
})
export class NeonCardComponent {

  @Input() contratoId!: number;             // <-- ahora lo recibe del padre
  @Output() paymentStarted = new EventEmitter<number>();
  loading = false;

  constructor(private http: HttpClient) {}

  iniciarPago() {
    if (!this.contratoId) {
      console.error('No se recibió contratoId en NeonCard');
      return;
    }

    this.loading = true;

    this.http.post<any>(`http://127.0.0.1:8000/api/pagos/${this.contratoId}/init`, {})
      .subscribe({
        next: res => {
          this.loading = false;
          // backend responde { status: 'ok', message: 'Pago iniciado', pago: { id, ... } }
          const pagoId = res?.pago?.id ?? null;
          if (!pagoId) {
            console.error('Respuesta inválida al iniciar pago', res);
            return;
          }
          this.paymentStarted.emit(pagoId); // enviamos el ID real del pago
        },
        error: err => {
          this.loading = false;
          console.error('Error iniciando pago', err);
        }
      });
  }
}
