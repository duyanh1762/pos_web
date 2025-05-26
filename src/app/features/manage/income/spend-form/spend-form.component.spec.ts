import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendFormComponent } from './spend-form.component';

describe('SpendFormComponent', () => {
  let component: SpendFormComponent;
  let fixture: ComponentFixture<SpendFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpendFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpendFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
