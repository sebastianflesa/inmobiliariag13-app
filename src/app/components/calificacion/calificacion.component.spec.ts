import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CalificacionService } from '../../services/calificacion.service';
import { ContratoService } from '../../services/contrato.service';
import { CalificacionComponent } from './calificacion.component';

// ===== MOCK SERVICES =====
class MockCalificacionService {
  getCalificaciones = jasmine.createSpy('getCalificaciones')
    .and.returnValue(of([{ id: 1, puntaje: 5 }]));

  createCalificacion = jasmine.createSpy('createCalificacion')
    .and.returnValue(of({ message: 'Calificación registrada' }));

  deleteCalificacion = jasmine.createSpy('deleteCalificacion')
    .and.returnValue(of({}));
}

class MockContratoService {
  getContratos = jasmine.createSpy('getContratos')
    .and.returnValue(of([
      {
        id: 10,
        cliente_id: 'C1',
        unidad_id: 'U1',
        proyecto_id: 'P1'
      }
    ]));
}

describe('CalificacionComponent', () => {
  let component: CalificacionComponent;
  let fixture: ComponentFixture<CalificacionComponent>;

  let calificacionService: MockCalificacionService;
  let contratoService: MockContratoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CalificacionComponent,
        CommonModule,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: CalificacionService, useClass: MockCalificacionService },
        { provide: ContratoService, useClass: MockContratoService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CalificacionComponent);
    component = fixture.componentInstance;
    calificacionService = TestBed.inject(CalificacionService) as any;
    contratoService = TestBed.inject(ContratoService) as any;

    fixture.detectChanges();
  });

  // ========= BASICO ==========
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ========= CARGA DE CONTRATOS ==========
  it('should load contratos on init', () => {
    expect(contratoService.getContratos).toHaveBeenCalled();
    expect(component.contratos.length).toBe(1);
    expect(component.contratos[0].id).toBe(10);
  });

  // ========= CARGA DE CALIFICACIONES ==========
  it('should load calificaciones on init', () => {
    expect(calificacionService.getCalificaciones).toHaveBeenCalled();
    expect(component.calificaciones.length).toBeGreaterThan(0);
  });

  // ========= CAMBIO DE CONTRATO ==========
  it('should auto-fill cliente_id, unidad_id y proyecto_id when contrato_id changes', () => {
    const form = component.califForm;

    form.get('contrato_id')?.setValue(10);

    expect(form.get('cliente_id')?.value).toBe('C1');
    expect(form.get('unidad_id')?.value).toBe('U1');
    expect(form.get('proyecto_id')?.value).toBe('P1');
  });

  // ========= VALIDACIÓN: FORMULARIO INVÁLIDO ==========
  it('should mark form invalid and not call createCalificacion when missing contrato_id', () => {
    const form = component.califForm;
    form.patchValue({
      contrato_id: '',
      puntaje: 5
    });

    component.crearCalificacion();

    expect(component.error).toBeTruthy();
    expect(calificacionService.createCalificacion).not.toHaveBeenCalled();
  });

  // ========= CREACIÓN DE CALIFICACIÓN ==========
  it('should send createCalificacion when form is valid', () => {
    const form = component.califForm;

    form.patchValue({
      contrato_id: 10,
      puntaje: 5,
      comentario: 'Todo ok'
    });

    component.crearCalificacion();

    expect(calificacionService.createCalificacion).toHaveBeenCalled();
    expect(component.success).toBe('Calificación registrada');
  });

  // ========= ERROR EN CREAR ==========
  it('should handle error when createCalificacion returns 422', () => {
    (calificacionService.createCalificacion as any)
      .and.returnValue(throwError(() => ({
        status: 422,
        error: { puntaje: ['Puntaje inválido'] }
      })));

    const form = component.califForm;

    form.patchValue({
      contrato_id: 10,
      puntaje: 99,
    });

    component.crearCalificacion();

    expect(component.error).toBe('Formulario inválido. Revisa los campos obligatorios.');
  });

  // ========= ELIMINAR CALIFICACIÓN ==========
  it('should call deleteCalificacion', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    component.eliminarCalificacion(1);

    expect(calificacionService.deleteCalificacion).toHaveBeenCalledWith(1);
  });

  // ========= DEBE DESUSCRIBIRSE ==========
  it('should unsubscribe on destroy', () => {
    const unsubscribeSpy = jasmine.createSpy('unsubscribe');

    (component as any).subs = [{ unsubscribe: unsubscribeSpy }];

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
