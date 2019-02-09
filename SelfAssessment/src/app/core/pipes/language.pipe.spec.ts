import { LanguagePipe } from './language.pipe';

xdescribe('LanguagePipe', () => {
  it('create an instance', () => {
    const pipe = new LanguagePipe();
    expect(pipe).toBeTruthy();
  });
});
