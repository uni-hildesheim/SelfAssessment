import { ScoreTextPipe } from './score-text.pipe';

describe('ScoreTextPipe', () => {

  const mockScoreDependentText: [number, string][] = [
    [33, 'below average message'],
    [66, 'average message'],
    [90, 'above average message'],
    [100, 'everything correct message']
  ];

  const fakeScores: [number, number][] = [ [0, 10], [4, 10], [7, 10], [10, 10] ];

  const scoreTextPipe = new ScoreTextPipe();

  it('should show correct text based on calculation ', () => {
    expect(scoreTextPipe.transform(mockScoreDependentText, fakeScores[0])).toBe('below average message');
    expect(scoreTextPipe.transform(mockScoreDependentText, fakeScores[1])).toBe('average message');
    expect(scoreTextPipe.transform(mockScoreDependentText, fakeScores[2])).toBe('above average message');
    expect(scoreTextPipe.transform(mockScoreDependentText, fakeScores[3])).toBe('everything correct message');
  });

});
