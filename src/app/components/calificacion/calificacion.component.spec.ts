import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CalificacionService } from '../../services/calificacion.service';
import { ContratoService } from '../../services/contrato.service';

@Component({
  selector: 'app-calificacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './calificacion.component.html',
  styleUrls: ['./calificacion.component.css']
})
export class CalificacionComponent implements OnInit, OnDestroy {
  calificaciones: any[] = [];
  contratos: any[] = [];
  califForm: FormGroup;

  loading = false;
  saving = false;
  error: string | null = null;
  success: string | null = null;

  private subs: Subscription[] = [];

  constructor(
    private calificacionService: CalificacionService,
    private contratoService: ContratoService,
    private fb: FormBuilder
  ) {
    this.califForm = this.fb.group({
      contrato_id: ['', Validators.required],
      // mantenemos los campos en el formulario pero los llenamos automáticamente
      cliente_id: [''], // no required aquí: lo setea el contrato
      unidad_id: [''],
      proyecto_id: [''],
      puntaje: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comentario: ['']
    });
  }

  ngOnInit(): void {
    this.loadLookups();
    this.loadCalificaciones();

    // Cuando cambia el contrato elegido, rellenar cliente_id, unidad_id, proyecto_id
    const contratoCtrl = this.califForm.get('contrato_id');
    if (contratoCtrl) {
      const sub = contratoCtrl.valueChanges.subscribe(id => {
        const c = this.contratos.find(x => String(x.id) === String(id));
        if (c) {
          // Adaptarse a la estructura de contrato que tengas:
          // preferimos cliente_id directo, si no, intentar extraer cliente.id
          const clienteId = c.cliente_id ?? (c.cliente && (c.cliente.id ?? c.cliente.rut)) ?? null;
          const unidadId = c.unidad_id ?? (c.unidad && c.unidad.id) ?? null;
          const proyectoId = c.proyecto_id ?? (c.unidad && c.unidad.proyecto_id) ?? null;

          this.califForm.patchValue({
            cliente_id: clienteId,
            unidad_id: unidadId,
            proyecto_id: proyectoId
          }, { emitEvent: false });
        } else {
          // limpiar si selecciona vacío
          this.califForm.patchValue({
            cliente_id: '',
            unidad_id: '',
            proyecto_id: ''
          }, { emitEvent: false });
        }
      });
      this.subs.push(sub);
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
        console.error('Error cargando contratos', err);
        this.error = 'Error cargando contratos';
        this.loading = false;
      }
    });
    this.subs.push(s);
  }

  loadCalificaciones() {
    this.loading = true;
    const s = this.calificacionService.getCalificaciones().subscribe({
      next: (res: any) => {
        this.calificaciones = Array.isArray(res) ? res : (res.data || []);
        this.loading = false;
      },
      error: err => {
        console.error('Error cargando calificaciones', err);
        this.error = 'Error cargando calificaciones';
        this.loading = false;
      }
    });
    this.subs.push(s);
  }

  crearCalificacion() {
    this.error = null;
    this.success = null;

    // Forzar validación
    if (this.califForm.invalid) {
      this.califForm.markAllAsTouched();
      this.error = 'Formulario inválido. Revisa los campos obligatorios.';
      return;
    }

    // Preparamos payload y validamos que cliente_id exista (porque backend exige)
    const payload = this.califForm.value;
    if (!payload.cliente_id) {
      // intentar inferir desde contratos
      const c = this.contratos.find(x => String(x.id) === String(payload.contrato_id));
      if (c) payload.cliente_id = c?.cliente_id ?? (c?.cliente?.id ?? null);
    }

    if (!payload.cliente_id) {
      this.error = 'No se pudo resolver cliente para el contrato seleccionado.';
      return;
    }

    console.log('Enviando payload calificacion:', payload);
    this.saving = true;

    const s = this.calificacionService.createCalificacion(payload).subscribe({
      next: (res: any) => {
        this.saving = false;
        this.success = res?.message || 'Calificación registrada';
        // reset conservando puntaje por defecto
        this.califForm.reset({ puntaje: 5, contrato_id: '', cliente_id: '', unidad_id: '', proyecto_id: '', comentario: '' });
        this.loadCalificaciones();
      },
      error: err => {
        this.saving = false;
        console.error('Error creando calificación', err);
        // si el backend devuelve errores de validación, mostrar el primero legible
        if (err?.status === 422 && err?.error) {
          const errors = err.error;
          const firstKey = Object.keys(errors)[0];
          this.error = Array.isArray(errors[firstKey]) ? errors[firstKey][0] : (errors[firstKey] || 'Error de validación');
        } else {
          this.error = err?.error?.message || 'Error creando calificación';
        }
      }
    });

    this.subs.push(s);
  }

  eliminarCalificacion(id: number) {
    if (!confirm('¿Eliminar calificación?')) return;
    const s = this.calificacionService.deleteCalificacion(id).subscribe({
      next: () => {
        this.loadCalificaciones();
      },
      error: err => {
        console.error('Error eliminando calificación', err);
        this.error = 'Error eliminando calificación';
      }
    });
    this.subs.push(s);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe && s.unsubscribe());
  }
}
