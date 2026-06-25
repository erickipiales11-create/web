import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmaciasLista } from './farmacias-lista';

describe('FarmaciasLista', () => {
  let component: FarmaciasLista;
  let fixture: ComponentFixture<FarmaciasLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarmaciasLista],
    }).compileComponents();

    fixture = TestBed.createComponent(FarmaciasLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
