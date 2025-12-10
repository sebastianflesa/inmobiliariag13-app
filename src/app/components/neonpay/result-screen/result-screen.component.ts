import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-result-screen',
  templateUrl: './result-screen.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./result-screen.component.css']
})
export class ResultScreenComponent {
  @Input() result!: 'approved' | 'rejected' | null;
  @Output() restartFlow = new EventEmitter<void>();

  restart() {
    this.restartFlow.emit();
  }

  // Agregar estas propiedades a tu result-screen.component.ts

  @Input() paymentInfo?: {
    amount: number;
    date: Date | string;
    contract?: string;
  };
  @Input() errorMessage?: string; // Para mostrar el motivo del rechazo

  // Ejemplo de valores que podrías pasar desde el componente padre:
  // <app-result-screen 
  //   [result]="'approved'" 
  //   [paymentInfo]="{amount: 50000, date: new Date(), contract: 'CTR-001'}">
  // </app-result-screen>
}
