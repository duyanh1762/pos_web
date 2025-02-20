import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderGoodsComponent } from './order-goods.component';

describe('OrderGoodsComponent', () => {
  let component: OrderGoodsComponent;
  let fixture: ComponentFixture<OrderGoodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderGoodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
