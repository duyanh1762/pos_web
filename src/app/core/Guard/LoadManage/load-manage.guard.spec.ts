import { TestBed } from '@angular/core/testing';

import { LoadManageGuard } from './load-manage.guard';

describe('LoadManageGuard', () => {
  let guard: LoadManageGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoadManageGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
