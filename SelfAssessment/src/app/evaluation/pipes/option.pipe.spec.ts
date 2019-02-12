import { OptionPipe } from './option.pipe';

xdescribe('OptionPipe', () => {
  it('create an instance', () => {
    const pipe = new OptionPipe();
    expect(pipe).toBeTruthy();
  });
});
