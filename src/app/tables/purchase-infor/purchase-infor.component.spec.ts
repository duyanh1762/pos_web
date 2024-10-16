import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseInforComponent } from './purchase-infor.component';

describe('PurchaseInforComponent', () => {
  let component: PurchaseInforComponent;
  let fixture: ComponentFixture<PurchaseInforComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseInforComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseInforComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
