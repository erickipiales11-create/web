import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescripcionesLista } from './prescripciones-lista';

describe('PrescripcionesLista', () => {
  let component: PrescripcionesLista;
  let fixture: ComponentFixture<PrescripcionesLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrescripcionesLista],
    }).compileComponents();

    fixture = TestBed.createComponent(PrescripcionesLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
