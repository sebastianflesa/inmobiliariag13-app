import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.css']
})
export class RegisterModalComponent {

  constructor(private authService: AuthService, public activeModal: NgbActiveModal) { }

  register(): void {
    this.activeModal.close();
    this.authService.registerWithCognito();
  }

  closeModal(): void {
    this.activeModal.close();
  }

}
