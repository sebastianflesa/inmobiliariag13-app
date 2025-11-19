import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { ProyectosComponent } from './proyectos.component';

describe('ProyectosComponent', () => {
  let component: ProyectosComponent;
  let fixture: ComponentFixture<ProyectosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectosComponent, HttpClientTestingModule, ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener un formulario inválido cuando está vacío', () => {
    expect(component.proyectoForm.valid).toBeFalsy();
  });

  it('debería tener un formulario válido cuando se llenan todos los campos correctamente', () => {
    component.proyectoForm.setValue({
      nombre: 'Proyecto 1',
      descripcion: 'Descripción del proyecto',
      ubicacion: 'Ubicación del proyecto',
      fecha_inicio: '2022-01-01',
      fecha_fin: '2022-12-31',
      estado: 'En progreso'
    });
    expect(component.proyectoForm.valid).toBeTruthy();
  });

  it('debería mostrar el formulario cuando se llama a mostrarFormularioCrear', () => {
    component.mostrarFormularioCrear();
    expect(component.mostrarFormulario).toBeTruthy();
  });

  it('debería editar un proyecto correctamente', () => {
    const proyecto = {
      id: 1,
      nombre: 'Proyecto 1',
      descripcion: 'Descripción del proyecto',
      ubicacion: 'Ubicación del proyecto',
      fecha_inicio: '2022-01-01',
      fecha_fin: '2022-12-31',
      estado: 'En progreso'
    };
    component.editarProyecto(proyecto);
    expect(component.modoEdicion).toBeTruthy();
    expect(component.proyectoSeleccionado).toEqual(proyecto);
  });

  it('debería crear un proyecto correctamente', () => {
    component.proyectoForm.setValue({
      nombre: 'Proyecto 1',
      descripcion: 'Descripción del proyecto',
      ubicacion: 'Ubicación del proyecto',
      fecha_inicio: '2022-01-01',
      fecha_fin: '2022-12-31',
      estado: 'En progreso'
    });
    component.crearProyecto();
    expect(component.proyectoForm.valid).toBeTruthy();
  });
});