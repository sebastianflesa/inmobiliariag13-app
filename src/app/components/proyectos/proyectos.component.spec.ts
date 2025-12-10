import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ProyectoService } from '../../services/proyecto.service';
import { ProyectosComponent } from './proyectos.component';

class MockProyectoService {
  getProyectos = jasmine.createSpy('getProyectos')
    .and.returnValue(of({ data: [] }));

  crearProyecto = jasmine.createSpy('crearProyecto')
    .and.returnValue(of({ message: 'creado' }));

  editarProyecto = jasmine.createSpy('editarProyecto')
    .and.returnValue(of({ message: 'editado' }));

  eliminarProyecto = jasmine.createSpy('eliminarProyecto')
    .and.returnValue(of({}));
}

describe('ProyectosComponent (MEJORADO)', () => {
  let component: ProyectosComponent;
  let fixture: ComponentFixture<ProyectosComponent>;
  let proyectoService: MockProyectoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectosComponent, ReactiveFormsModule, CommonModule],
      providers: [
        { provide: ProyectoService, useClass: MockProyectoService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProyectosComponent);
    component = fixture.componentInstance;
    proyectoService = TestBed.inject(ProyectoService) as any;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debería cargar los proyectos', () => {
    const mockResponse = {
      data: [
        {
          id: '1',
          nombre: 'Proyecto Test',
          descripcion: 'Descripción',
          ubicacion: 'Ubicación',
          fecha_inicio: '2025-01-01',
          fecha_fin: '2025-12-31',
          estado: 'Activo'
        }
      ]
    };

    proyectoService.getProyectos.and.returnValue(of(mockResponse));

    component.ngOnInit();

    expect(proyectoService.getProyectos).toHaveBeenCalled();
    expect(component.proyectos).toEqual(mockResponse.data);
  });


  it('ngOnInit debería manejar errores del servicio', () => {
    proyectoService.getProyectos.and.returnValue(
      throwError(() => new Error('Error cargando'))
    );

    spyOn(console, 'error');

    component.ngOnInit();

    expect(console.error).toHaveBeenCalled();
  });

  it('el formulario debería ser inválido cuando está vacío', () => {
    expect(component.proyectoForm.valid).toBeFalse();
  });

  it('el formulario debería ser válido cuando se llenan todos los campos', () => {
    component.proyectoForm.setValue({
      nombre: 'Proyecto',
      descripcion: 'Desc',
      ubicacion: 'Ubicación',
      fecha_inicio: '2025-01-01',
      fecha_fin: '2025-02-01',
      estado: 'Activo'
    });

    expect(component.proyectoForm.valid).toBeTrue();
  });

  it('mostrarFormularioCrear debería activar el formulario y desactivar modo edición', () => {
    component.mostrarFormularioCrear();

    expect(component.mostrarFormulario).toBeTrue();
    expect(component.modoEdicion).toBeFalse();
  });

  it('editarProyecto debería cargar los valores en el formulario', () => {
    const proyecto = {
      id: 1,
      nombre: 'Proyecto 1',
      descripcion: 'Desc',
      ubicacion: 'Ubicación',
      fecha_inicio: '2022-01-01',
      fecha_fin: '2022-12-31',
      estado: 'Activo'
    };

    component.editarProyecto(proyecto);

    expect(component.modoEdicion).toBeTrue();
    expect(component.proyectoSeleccionado).toEqual(proyecto);
    expect(component.proyectoForm.value.nombre).toBe('Proyecto 1');
  });

  it('crearProyecto debería llamar al servicio cuando el formulario es válido (crear)', () => {
    spyOn(component, 'crearProyecto').and.callThrough();

    component.proyectoForm.setValue({
      nombre: 'Ejemplo',
      descripcion: 'Desc',
      ubicacion: 'Ubicación',
      fecha_inicio: '2025-01-01',
      fecha_fin: '2025-02-02',
      estado: 'Activo'
    });

    component.crearProyecto();

    expect(component.crearProyecto).toHaveBeenCalled();
    expect(proyectoService.crearProyecto).toHaveBeenCalled();
    expect(component.proyectoCreado).toBeTrue();
  });

  it('crearProyecto debería llamar a editarProyecto cuando está en modo edición', () => {
    const proyectoMock = { id: 3 };
    component.modoEdicion = true;
    component.proyectoSeleccionado = proyectoMock;

    component.proyectoForm.setValue({
      nombre: 'X',
      descripcion: 'X',
      ubicacion: 'X',
      fecha_inicio: '2025-01-01',
      fecha_fin: '2025-02-02',
      estado: 'Activo'
    });

    component.crearProyecto();

    expect(proyectoService.editarProyecto).toHaveBeenCalledWith(
      3,
      jasmine.any(Object)
    );
    expect(component.proyectoEditado).toBeTrue();
  });

  it('crearProyecto debería marcar los campos como tocados si el formulario es inválido', () => {
    spyOn(component.proyectoForm, 'markAllAsTouched');

    component.crearProyecto();

    expect(component.proyectoForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('eliminarProyecto debería llamar al servicio y recargar proyectos', () => {
    const proyecto = { id: 7 };

    component.eliminarProyecto(proyecto);

    expect(proyectoService.eliminarProyecto).toHaveBeenCalledWith(7);
    expect(proyectoService.getProyectos).toHaveBeenCalled();
  });
});
