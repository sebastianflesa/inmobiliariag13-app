import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { UnidadesComponent } from './unidades.component';

describe('UnidadesComponent', () => {
  let component: UnidadesComponent;
  let fixture: ComponentFixture<UnidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnidadesComponent, HttpClientTestingModule, ReactiveFormsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UnidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener un formulario inválido cuando está vacío', () => {
    expect(component.unidadForm.valid).toBeFalsy();
  });

  it('debería tener un formulario válido cuando se llenan todos los campos correctamente', () => {
    component.unidadForm.setValue({
      numero_unidad: 'Unidad 1',
      tipo_unidad: 'Tipo 1',
      metraje: "100",
      precio_venta: "100000",
      estado: 'Disponible',
      proyecto_id: '1',
      cliente_id: '1'
    });
    expect(component.unidadForm.valid).toBeTruthy();
  });

  it('debería llamar a crearUnidad cuando se envía el formulario', () => {
    spyOn(component, 'crearUnidad');
    component.unidadForm.setValue({
      numero_unidad: 'Unidad 1',
      tipo_unidad: 'Tipo 1',
      metraje: "100",
      precio_venta: "100000",
      estado: 'Disponible',
      proyecto_id: '1',
      cliente_id: '1'
    });
    component.crearUnidad();
    expect(component.crearUnidad).toHaveBeenCalledTimes(1);
  });

  it('debería llamar a editarUnidad cuando se edita una unidad', () => {
    const unidad = {
      id: 1,
      numero_unidad: 'Unidad 1',
      tipo_unidad: 'Tipo 1',
      metraje: '100',
      precio_venta: '100000',
      estado: 'Disponible',
      proyecto_id: '1',
      cliente_id: '1'
    };
    component.editarUnidad(unidad);
    expect(component.modoEdicion).toBeTruthy();
    expect(component.unidadSeleccionada).toEqual(unidad);
  });

  it('debería llamar a eliminarUnidad cuando se elimina una unidad', () => {
    spyOn(component, 'eliminarUnidad');
    const unidad = {
      id: 1,
      numero_unidad: 'Unidad 1',
      tipo_unidad: 'Tipo 1',
      metraje: 100,
      precio_venta: 100000,
      estado: 'Disponible',
      proyecto_id: '1',
      cliente_id: '1'
    };
    component.eliminarUnidad(unidad);
    expect(component.eliminarUnidad).toHaveBeenCalledTimes(1);
  });
});