import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportStaffComponent } from './report-staff.component';

describe('ReportStaffComponent', () => {
  let component: ReportStaffComponent;
  let fixture: ComponentFixture<ReportStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportStaffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
