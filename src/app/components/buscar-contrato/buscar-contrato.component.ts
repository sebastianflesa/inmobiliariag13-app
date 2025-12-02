import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buscar-contrato',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buscar-contrato.component.html',
  styleUrls: ['./buscar-contrato.component.css']
})
export class BuscarContratoComponent {

  rut = '';
  cliente: any = null;
  contratos: any[] = [];
  loading = false;
  errorMsg = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  buscarRut() {
    if (!this.rut) return;

    this.errorMsg = '';
    this.loading = true;

    this.http.get(`http://127.0.0.1:8000/api/contratos/buscar-rut/${this.rut}`)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.cliente = response.cliente;
          this.contratos = response.contratos;

          console.log('CLIENTE:', this.cliente);
          console.log('CONTRATOS:', this.contratos);
        },
        error: err => {
          this.loading = false;
          console.error(err);
          this.errorMsg = 'No encontrado';
        }
      });
  }

  pagar(contrato: any) {
    // ⚠️ Aquí capturamos perfectamente el contrato.id para ir a Neonpay
    this.router.navigate(['/neonpay', contrato.id]);
  }
}
