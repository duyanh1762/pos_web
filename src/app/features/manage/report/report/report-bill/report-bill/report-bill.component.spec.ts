import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportBillComponent } from './report-bill.component';

describe('ReportBillComponent', () => {
  let component: ReportBillComponent;
  let fixture: ComponentFixture<ReportBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
