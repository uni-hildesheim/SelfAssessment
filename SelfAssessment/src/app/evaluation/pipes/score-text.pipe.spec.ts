import { ScoreTextPipe } from './score-text.pipe';

xdescribe('ScoreTextPipe', () => {
  it('create an instance', () => {
    const pipe = new ScoreTextPipe();
    expect(pipe).toBeTruthy();
  });
});
