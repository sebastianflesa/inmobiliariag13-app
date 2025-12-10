import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { ProyectoService } from '../../services/proyecto.service';
import { UnidadService } from '../../services/unidad.service';
import { forkJoin } from 'rxjs';

interface Unidad {
  id: string;
  numero_unidad: string;
  tipo_unidad: string;
  metraje: number;
  precio_venta: number;
  estado: string;
  proyecto_id: string;
  cliente_id: string;
}

@Component({
  selector: 'app-unidades',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './unidades.component.html',
  styleUrls: ['./unidades.component.css']
})
export class UnidadesComponent implements OnInit {
  unidades: Unidad[] = [];
  proyectos: any[] = [];
  clientes: any[] = [];

  unidadForm = new FormGroup({
    numero_unidad: new FormControl<string | null>('', Validators.required),
    tipo_unidad: new FormControl<string | null>('', Validators.required),
    metraje: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.pattern(/^[1-9][0-9]*$/)
    ]),
    precio_venta: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.pattern(/^[1-9][0-9]*$/)
    ]),
    estado: new FormControl<string | null>('', Validators.required),
    proyecto_id: new FormControl<string | null>('', Validators.required),
    cliente_id: new FormControl<string | null>('')
  });

  mostrarFormulario = false;
  unidadCreada = false;
  unidadEditada = false;

  unidadSeleccionada: any = null;
  modoEdicion = false;
  loading = false;
  error: string | null = null;
  saving = false;
  deleting = false;
  errorModalMessage: string | null = null;

  constructor(
    private unidadService: UnidadService,
    private proyectoService: ProyectoService,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    forkJoin([
      this.unidadService.getUnidades(),
      this.proyectoService.getProyectos(),
      this.clienteService.getClientes()
    ]).subscribe({
      next: ([unidadesRes, proyectosRes, clientesRes]: any[]) => {
        const unidadesData = unidadesRes.data ?? unidadesRes;
        this.unidades = (unidadesData || []).map((u: any) => ({
          ...u,
          metraje: Number(u.metraje) > 0 ? Number(u.metraje) : 1,
          precio_venta: Number(u.precio_venta) > 0 ? Number(u.precio_venta) : 1
        }));
        this.proyectos = proyectosRes.data ?? proyectosRes;
        this.clientes = clientesRes.data ?? clientesRes;
        this.loading = false;
      },
      error: err => {
        console.error('Error cargando datos de unidades', err);
        this.error = 'Error al cargar unidades';
        this.loading = false;
      }
    });
  }

  crearUnidad(): void {
    if (!this.unidadForm.valid) {
      this.unidadForm.markAllAsTouched();
      return;
    }

    const metraje = Number(this.unidadForm.value.metraje);
    const precio = Number(this.unidadForm.value.precio_venta);

    const unidadData: any = {
      ...this.unidadForm.value,
      metraje,
      precio_venta: precio
    };
    this.saving = true;

    if (this.modoEdicion) {
      this.editar(unidadData);
    } else {
      this.crear(unidadData);
    }
  }

  private crear(unidad: any) {
    this.loading = true;
    this.unidadService.crearUnidad(unidad).subscribe({
      next: () => {
        this.unidadService.getUnidades().subscribe(response => {
          this.unidades = response.data;
          this.unidadForm.reset();
          this.mostrarFormulario = false;
          this.unidadCreada = true;
          setTimeout(() => this.unidadCreada = false, 2000);
          this.loading = false;
          this.saving = false;
        }, () => {
          this.loading = false;
          this.saving = false;
        });
      },
      error: () => {
        this.errorModalMessage = 'No se pudo crear la unidad. Intenta nuevamente.';
        this.loading = false;
        this.saving = false;
      }
    });
  }

  private editar(unidad: any) {
    const id = this.unidadSeleccionada.id;

    this.loading = true;
    this.unidadService.editarUnidad(id, unidad).subscribe({
      next: () => {
        this.unidadService.getUnidades().subscribe(response => {
          this.unidades = response.data;
          this.unidadForm.reset();
          this.mostrarFormulario = false;
          this.unidadEditada = true;
          setTimeout(() => this.unidadEditada = false, 2000);
          this.loading = false;
          this.saving = false;
        }, () => {
          this.loading = false;
          this.saving = false;
        });
      },
      error: () => {
        this.errorModalMessage = 'No se pudo editar la unidad. Intenta nuevamente.';
        this.loading = false;
        this.saving = false;
      }
    });
  }

  editarUnidad(unidad: any): void {
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.unidadSeleccionada = unidad;

    this.unidadForm.patchValue({
      numero_unidad: unidad.numero_unidad,
      tipo_unidad: unidad.tipo_unidad,
      metraje: unidad.metraje,
      precio_venta: unidad.precio_venta,
      estado: unidad.estado,
      proyecto_id: unidad.proyecto_id,
      cliente_id: unidad.cliente_id
    });
  }

  eliminarUnidad(unidad: any): void {
    if (!confirm('¿Seguro que deseas eliminar esta unidad?')) {
      return;
    }
    this.deleting = true;
    this.unidadService.eliminarUnidad(unidad.id).subscribe({
      next: () => {
        this.unidadService.getUnidades().subscribe(response => {
          this.unidades = response.data;
          this.deleting = false;
        }, () => {
          this.deleting = false;
        });
      },
      error: () => {
        this.errorModalMessage = 'No se pudo eliminar la unidad. Intenta nuevamente.';
        this.deleting = false;
      }
    });
  }

  getProyectoNombre(id: string): string {
    const proyecto = this.proyectos.find(p => p.id === id);
    return proyecto ? proyecto.nombre : '';
  }

  getClienteRut(id: string): string {
    const cliente = this.clientes.find(c => c.id === id);
    return cliente ? cliente.rut : '';
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.modoEdicion = false;
      this.unidadSeleccionada = null;
      this.unidadForm.reset();
    }
  }

  cerrarErrorModal(): void {
    this.errorModalMessage = null;
  }
}
