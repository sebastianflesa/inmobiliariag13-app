import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription, forkJoin } from 'rxjs';
import { ClienteService } from '../../services/cliente.service';
import { ContratoService } from '../../services/contrato.service';
import { UnidadService } from '../../services/unidad.service';

@Component({
  selector: 'app-contratos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.css']
})
export class ContratosComponent implements OnInit, OnDestroy {
  contratoForm: FormGroup;
  contratos: any[] = [];
  clientes: any[] = [];
  unidades: any[] = [];
  mostrarFormulario = false;

  loading = false;
  saving = false;
  error: string | null = null;
  loadingTabla = false;
  deleting = false;
  errorModalMessage: string | null = null;

  private subs: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private contratoService: ContratoService,
    private clienteService: ClienteService,
    private unidadService: UnidadService
  ) {
    this.contratoForm = this.fb.group({
      cliente_id: ['', Validators.required],
      unidad_id: ['', Validators.required],
      tipo_contrato: ['arriendo', Validators.required],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      monto_total: ['', [Validators.required, Validators.min(1)]],
      estado: ['activo', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadLookup();
    this.loadContratos();
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.contratoForm.reset({
        tipo_contrato: 'arriendo',
        estado: 'activo'
      });
      this.errorModalMessage = null;
    }
  }

  private loadLookup() {
    this.loading = true;
    const oClientes = this.clienteService.getClientes();
    const oUnidades = this.unidadService.getUnidades();

    const s = forkJoin([oClientes, oUnidades]).subscribe({
      next: ([clientesRes, unidadesRes]: any) => {
        this.clientes = Array.isArray(clientesRes) ? clientesRes : (clientesRes.data || []);
        this.unidades = Array.isArray(unidadesRes) ? unidadesRes : (unidadesRes.data || []);
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.error = 'Error al cargar clientes o unidades';
        this.loading = false;
      }
    });

    this.subs.push(s);
  }

  loadContratos() {
    this.loading = true;
    this.loadingTabla = true;
    const s = this.contratoService.getContratos().subscribe({
      next: (res: any) => {
        console.log('Contratos API response:', res);
        this.contratos = Array.isArray(res) ? res : (res.data || []);
        this.loading = false;
        this.loadingTabla = false;
      },
      error: err => {
        console.error(err);
        this.error = 'Error al cargar contratos';
        this.loading = false;
        this.loadingTabla = false;
      }
    });
    this.subs.push(s);
  }

  crearContrato() {
    if (this.contratoForm.invalid) {
      this.contratoForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorModalMessage = null;
    const payload = this.contratoForm.value;
    const s = this.contratoService.createContrato(payload).subscribe({
      next: (res: any) => {
        this.saving = false;
        this.contratoForm.reset({ tipo_contrato: 'arriendo', estado: 'activo' });
        this.mostrarFormulario = false;
        this.loadContratos();
      },
      error: err => {
        console.error(err);
        this.error = err?.error?.message || 'Error creando contrato';
        this.errorModalMessage = 'No se pudo crear el contrato. Intenta nuevamente.';
        this.saving = false;
      }
    });

    this.subs.push(s);
  }

  eliminarContrato(id: number) {
    if (!confirm('¿Eliminar contrato?')) return;
    this.deleting = true;
    const s = this.contratoService.deleteContrato(id).subscribe({
      next: () => {
        this.deleting = false;
        this.loadContratos();
      },
      error: err => {
        console.error(err);
        this.error = 'Error eliminando contrato';
        this.errorModalMessage = 'No se pudo eliminar el contrato. Intenta nuevamente.';
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
