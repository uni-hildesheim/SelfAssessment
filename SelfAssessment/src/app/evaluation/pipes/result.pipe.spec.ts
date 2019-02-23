import { ResultPipe } from './result.pipe';
import { ResultSet } from 'src/app/shared/models/evaluation/result.set';

describe('ResultPipe', () => {

  const mockResultSets = [
    {
      tests: [
        { 'score': 5, 'maxScore': 10 },
        { 'score': 2, 'maxScore': 6 },
        { 'score': 4, 'maxScore': 12 }
      ]
    },
    {
      tests: [
        { 'score': 0, 'maxScore': 3 },
        { 'score': 4, 'maxScore': 4 },
        { 'score': 2, 'maxScore': 10 }
      ]
    }
  ] as ResultSet[];

  const resultPipe = new ResultPipe();

  it('should calculate the total values over all result sets', () => {
    expect(resultPipe.transform(mockResultSets, true)).toEqual([17, 45]);
  });

  it('should calculate the values of one result set', () => {
    expect(resultPipe.transform(mockResultSets[0])).toEqual([11, 28]);
    expect(resultPipe.transform(mockResultSets[1])).toEqual([6, 17]);
  });

});
