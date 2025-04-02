import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailGoodsComponent } from './detail-goods.component';

describe('DetailGoodsComponent', () => {
  let component: DetailGoodsComponent;
  let fixture: ComponentFixture<DetailGoodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailGoodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
