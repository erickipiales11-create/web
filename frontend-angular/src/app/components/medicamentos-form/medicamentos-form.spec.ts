import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicamentosForm } from './medicamentos-form';

describe('MedicamentosForm', () => {
  let component: MedicamentosForm;
  let fixture: ComponentFixture<MedicamentosForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicamentosForm],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicamentosForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
