import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { NeonCardComponent } from './neon-card/neon-card.component';
import { OtpScreenComponent } from './otp-screen/otp-screen.component';
import { PinScreenComponent } from './pin-screen/pin-screen.component';
import { ResultScreenComponent } from './result-screen/result-screen.component';

@Component({
  selector: 'app-neonpay',
  standalone: true,
  templateUrl: './neonpay.component.html',
  styleUrls: ['./neonpay.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    NeonCardComponent,
    PinScreenComponent,
    OtpScreenComponent,
    ResultScreenComponent
  ]
})
export class NeonpayComponent {

  contratoId: number | null = null; // id del contrato (ruta)
  paymentId: number | null = null;  // id del pago (pago.id devuelto por init)
  step = 1; // 1: card → 2: PIN → 3: OTP → 4: Resultado
  paymentResult: any = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.contratoId = isNaN(id) ? null : id;
    console.log('Neonpay: contratoId =', this.contratoId);
  }

  // recibe el paymentId (pago.id) desde NeonCard
  onPaymentStarted(pagoId: number) {
    console.log('onPaymentStarted -> pagoId =', pagoId);
    this.paymentId = pagoId;
    this.step = 2;
  }

  onPinValidated(ok: boolean) {
    console.log('onPinValidated =>', ok);
    if (ok) {
      this.step = 3;
    } else {
      this.paymentResult = { status: 'rejected', message: 'PIN incorrecto' };
      this.step = 4;
    }
  }

  onOtpValidated(result: 'approved' | 'rejected') {
    this.paymentResult = result === 'approved'
      ? { status: 'approved' }
      : { status: 'rejected', message: 'OTP inválido' };
    this.step = 4;
  }

  restart() {
    this.step = 1;
    this.paymentId = null;
    this.paymentResult = null;
  }

}
