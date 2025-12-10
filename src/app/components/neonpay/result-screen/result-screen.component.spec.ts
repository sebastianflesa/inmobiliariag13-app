import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultScreenComponent } from './result-screen.component';

describe('ResultScreenComponent', () => {

  let component: ResultScreenComponent;
  let fixture: ComponentFixture<ResultScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultScreenComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debe aceptar valores de resultado', () => {
    component.result = 'approved';
    expect(component.result).toBe('approved');

    component.result = 'rejected';
    expect(component.result).toBe('rejected');

    component.result = null;
    expect(component.result).toBeNull();
  });

  it('debe emitir restartFlow al ejecutar restart()', () => {
    const spy = spyOn(component.restartFlow, 'emit');
    component.restart();
    expect(spy).toHaveBeenCalled();
  });

});
