import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InforComponent } from './infor.component';

describe('InforComponent', () => {
  let component: InforComponent;
  let fixture: ComponentFixture<InforComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InforComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InforComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
