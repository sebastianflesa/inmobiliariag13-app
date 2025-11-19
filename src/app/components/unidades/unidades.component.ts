import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ClienteService } from '../../services/cliente.service';
import { ProyectoService } from '../../services/proyecto.service';
import { UnidadService } from '../../services/unidad.service';

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

interface UnidadForm {
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
  isLoadingUnidades = false;
  isLoadingProyectos = false;
  isLoadingClientes = false;
  errorMessage: string | null = null;
  unidadForm = new FormGroup({
    numero_unidad: new FormControl('', Validators.required),
    tipo_unidad: new FormControl('', Validators.required),
    metraje: new FormControl('', Validators.required),
    precio_venta: new FormControl('', Validators.required),
    estado: new FormControl('', Validators.required),
    proyecto_id: new FormControl('', Validators.required),
    cliente_id: new FormControl('')
  });
  mostrarFormulario = false;
  unidadCreada = false;
  unidadEditada = false;
  unidadSeleccionada: any = null;
  modoEdicion = false;

  constructor(private unidadService: UnidadService, private proyectoService: ProyectoService, private clienteService: ClienteService) { }

  ngOnInit(): void {
    this.loadUnidades();
    this.loadProyectos();
    this.loadClientes();
  }

  private loadUnidades(onSuccess?: () => void): void {
    this.isLoadingUnidades = true;
    this.errorMessage = null;
    this.unidadService.getUnidades()
      .pipe(finalize(() => this.isLoadingUnidades = false))
      .subscribe({
        next: (response: any) => {
          this.unidades = response.data;
          onSuccess?.();
        },
        error: (error: any) => {
          console.error('Error al obtener unidades:', error);
          this.errorMessage = 'No se pudieron cargar las unidades. Intenta nuevamente.';
        }
      });
  }

  private loadProyectos(): void {
    this.isLoadingProyectos = true;
    this.proyectoService.getProyectos()
      .pipe(finalize(() => this.isLoadingProyectos = false))
      .subscribe({
        next: (response: any) => {
          this.proyectos = response.data;
        },
        error: (error: any) => {
          console.error('Error al obtener proyectos:', error);
          this.errorMessage = 'No se pudieron cargar los proyectos. Intenta nuevamente.';
        }
      });
  }

  private loadClientes(): void {
    this.isLoadingClientes = true;
    this.clienteService.getClientes()
      .pipe(finalize(() => this.isLoadingClientes = false))
      .subscribe({
        next: (response: any) => {
          this.clientes = response.data;
        },
        error: (error: any) => {
          console.error('Error al obtener clientes:', error);
          this.errorMessage = 'No se pudieron cargar los clientes. Intenta nuevamente.';
        }
      });
  }

  crearUnidad(): void {
    if (this.unidadForm.valid) {
      const unidadFormValue = {
        ...this.unidadForm.value,
        metraje: Number(this.unidadForm.value.metraje),
        precio_venta: Number(this.unidadForm.value.precio_venta)
      } as UnidadForm;

      if (this.modoEdicion) {
        const unidad: Unidad = {
          id: this.unidadSeleccionada.id,
          ...unidadFormValue
        };
        this.unidadService.editarUnidad(unidad.id, unidad).subscribe(response => {
          this.loadUnidades(() => {
            this.unidadForm.reset();
            this.mostrarFormulario = false;
            this.unidadEditada = true;
            setTimeout(() => {
              this.unidadEditada = false;
            }, 2000);
          });
        }, (error) => {
          console.error(error);
          this.errorMessage = 'No se pudo editar la unidad. Intenta nuevamente.';
        });
      } else {
        const unidad: Unidad = {
          id: '',
          ...unidadFormValue
        };
        this.unidadService.crearUnidad(unidad).subscribe(response => {
          this.loadUnidades(() => {
            this.unidadForm.reset();
            this.mostrarFormulario = false;
            this.unidadCreada = true;
            setTimeout(() => {
              this.unidadCreada = false;
            }, 2000);
          });
        }, (error) => {
          console.error(error);
          this.errorMessage = 'No se pudo crear la unidad. Intenta nuevamente.';
        });
      }
    } else {
      this.unidadForm.markAllAsTouched();
    }
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
    this.unidadService.eliminarUnidad(unidad.id).subscribe({
      next: () => this.loadUnidades(),
      error: (error) => {
        console.error(error);
        this.errorMessage = 'No se pudo eliminar la unidad. Intenta nuevamente.';
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
}
