import { Pipe, PipeTransform } from '@angular/core';
import { ResultSet } from 'src/app/shared/models/evaluation/result.set';

/**
 * Pipe that calculates the total and the obtained
 * score of a set.
 * Output: <user-specific-score>/<max-set-score>
 */
@Pipe({
  name: 'result'
})
export class ResultPipe implements PipeTransform {

  /**
   * Transforms the score.
   *
   * @param set The set.
   */
  transform(set: ResultSet): number[] {
    let sum = 0;
    let value = 0;

    set.tests.forEach(elem => {
      sum += elem.maxScore;
      value += elem.score;
    });

    return [value, sum];
  }

}
