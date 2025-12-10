import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ContratoService } from '../../services/contrato.service';
import { PagoService } from '../../services/pago.service';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent implements OnInit, OnDestroy {
  pagos: any[] = [];
  contratos: any[] = [];
  pagoForm: FormGroup;

  loading = false;
  saving = false;
  error: string | null = null;
  mostrarFormulario = false;
  loadingTabla = false;
  deleting = false;
  errorModalMessage: string | null = null;

  private subs: Subscription[] = [];

  constructor(
    private pagoService: PagoService,
    private contratoService: ContratoService,
    private fb: FormBuilder
  ) {
    this.pagoForm = this.fb.group({
      contrato_id: ['', Validators.required],
      monto: ['', [Validators.required, Validators.min(1)]],
      fecha_pago: ['', Validators.required],
      metodo_pago: ['transferencia', Validators.required],
      estado: ['pendiente', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadLookups();
    this.loadPagos();
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.pagoForm.reset({ metodo_pago: 'transferencia', estado: 'pendiente' });
    }
  }

  loadLookups() {
    this.loading = true;
    const s = this.contratoService.getContratos().subscribe({
      next: (res: any) => {
        this.contratos = Array.isArray(res) ? res : (res.data || []);
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.error = 'Error cargando contratos';
        this.loading = false;
      }
    });
    this.subs.push(s);
  }

  loadPagos() {
    this.loading = true;
    this.loadingTabla = true;
    const s = this.pagoService.getPagos().subscribe({
      next: (res: any) => {
        this.pagos = Array.isArray(res) ? res : (res.data || []);
        this.loading = false;
        this.loadingTabla = false;
      },
      error: err => {
        console.error(err);
        this.error = 'Error cargando pagos';
        this.loading = false;
        this.loadingTabla = false;
      }
    });
    this.subs.push(s);
  }

  crearPago() {
    if (this.pagoForm.invalid) {
      this.pagoForm.markAllAsTouched();
      return;
    }
    this.saving = true;
    const payload = this.pagoForm.value;
    const s = this.pagoService.createPago(payload).subscribe({
      next: (res: any) => {
        this.saving = false;
        this.pagoForm.reset({ metodo_pago: 'transferencia', estado: 'pendiente' });
        this.mostrarFormulario = false;
        this.loadPagos();
      },
      error: err => {
        console.error(err);
        this.error = err?.error?.message || 'Error creando pago';
        this.errorModalMessage = 'No se pudo crear el pago. Intenta nuevamente.';
        this.saving = false;
      }
    });
    this.subs.push(s);
  }

  eliminarPago(id: number) {
    if (!confirm('¿Eliminar pago?')) return;
    this.deleting = true;
    const s = this.pagoService.deletePago(id).subscribe({
      next: () => {
        this.deleting = false;
        this.loadPagos();
      },
      error: err => {
        console.error(err);
        this.error = 'Error eliminando pago';
        this.errorModalMessage = 'No se pudo eliminar el pago. Intenta nuevamente.';
        this.deleting = false;
      }
    });
    this.subs.push(s);
  }

  cerrarErrorModal(): void {
    this.errorModalMessage = null;
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe && s.unsubscribe());
  }
}
