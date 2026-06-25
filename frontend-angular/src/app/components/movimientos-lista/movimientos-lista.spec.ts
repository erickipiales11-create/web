import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientosLista } from './movimientos-lista';

describe('MovimientosLista', () => {
  let component: MovimientosLista;
  let fixture: ComponentFixture<MovimientosLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimientosLista],
    }).compileComponents();

    fixture = TestBed.createComponent(MovimientosLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
