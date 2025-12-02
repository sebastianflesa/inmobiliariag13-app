import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-result-screen',
  templateUrl: './result-screen.component.html',
  standalone: true,
  styleUrls: ['./result-screen.component.css']
})
export class ResultScreenComponent {
  @Input() result!: 'approved' | 'rejected' | null;
  @Output() restartFlow = new EventEmitter<void>();

  restart() {
    this.restartFlow.emit();
  }
}
