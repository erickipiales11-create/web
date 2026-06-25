import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmaciasForm } from './farmacias-form';

describe('FarmaciasForm', () => {
  let component: FarmaciasForm;
  let fixture: ComponentFixture<FarmaciasForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarmaciasForm],
    }).compileComponents();

    fixture = TestBed.createComponent(FarmaciasForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
