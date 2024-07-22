import { MoneyTransformPipe } from './money-transform.pipe';

describe('MoneyTransformPipe', () => {
  it('create an instance', () => {
    const pipe = new MoneyTransformPipe();
    expect(pipe).toBeTruthy();
  });
});
