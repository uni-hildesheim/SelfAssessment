import { Pipe, PipeTransform } from '@angular/core';
import { ResultSet } from 'src/app/shared/models/evaluation/result.set';

@Pipe({
  name: 'result'
})
export class ResultPipe implements PipeTransform {

  transform(set: ResultSet, args?: any): string {
    let sum = 0;
    let value = 0;

    set.tests.forEach(elem => {
      sum += elem.maxScore;
      value += elem.score;
    });

    return `Punkte: ${value} / ${sum}`;
  }

}
