import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BacklogGoodsComponent } from './backlog-goods.component';

describe('BacklogGoodsComponent', () => {
  let component: BacklogGoodsComponent;
  let fixture: ComponentFixture<BacklogGoodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BacklogGoodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BacklogGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
