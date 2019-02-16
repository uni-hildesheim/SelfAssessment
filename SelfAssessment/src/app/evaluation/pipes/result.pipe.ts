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
  transform(sets: any, totalVal?: true): number[] {

    if (totalVal) {
      let total = 0;
      let totalMax = 0;
      sets.forEach((set: ResultSet) => {
        set.tests.forEach(elem => {
          total += elem.score;
          totalMax += elem.maxScore;
        });
      });
      return [total, totalMax];

    } else {
      let sum = 0;
      let value = 0;
      sets.tests.forEach(elem => {
        sum += elem.maxScore;
        value += elem.score;
      });
      return [value, sum];
    }



  }


}
