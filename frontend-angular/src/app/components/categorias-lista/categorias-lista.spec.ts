import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasLista } from './categorias-lista';

describe('CategoriasLista', () => {
  let component: CategoriasLista;
  let fixture: ComponentFixture<CategoriasLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriasLista],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriasLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
