import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillEditorComponent } from './bill-editor.component';

describe('BillEditorComponent', () => {
  let component: BillEditorComponent;
  let fixture: ComponentFixture<BillEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
