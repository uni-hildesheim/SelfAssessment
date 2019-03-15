import { Category } from './../../shared/models/procedure/enums/category.enum';
import { Pipe, PipeTransform } from '@angular/core';
import { ResultTest } from 'src/app/shared/models/evaluation/result.test';
import { MultipleOptions } from 'src/app/shared/models/procedure/categories/multiple.options.test';

/**
 * Transforms a test option according to the category.
 * - speed test: the picked string is highlighted accordingly.
 * - multiple-options: the choosen header is assigned to the option.
 */
@Pipe({
  name: 'option'
})
export class OptionPipe implements PipeTransform {

  constructor() { }

  /**
   * Transform the option.
   *
   * @param test The test.
   * @param i The index of the choosen option.
   * @param opt Specifies if this choosen option is correct.
   */
  transform(test: ResultTest, i: number, opt: boolean): any {
    const category = test.singleTest.category;
    let optText: string;

    if (category === Category.RADIO_BUTTONS
      || category === Category.MULTIPLE_CHOICE) {
      optText = test.singleTest.options[i].text;

    } else if (category === Category.MULTIPLE_OPTIONS) {
      let header: string;
      const mTest: MultipleOptions = test.singleTest as MultipleOptions;

      test.log[i].forEach((element: boolean, j: number) => {
        if (element === true) {
          header = mTest.header[j];
        }
      });
      const option = test.singleTest.options[i].text;
      optText = `${option}: ${header}`;

    } else if (category === Category.MATCH) {
      const content = test.singleTest.options[i].text;
      const cssClass = (opt) ? 'correct-pick' : 'wrong-pick';
      const match = content.substr(test.log[i][0], test.log[i][1] - test.log[i][0]);
      const left = content.substr(0, test.log[i][0]);
      const right = content.substr(test.log[i][0] + (test.log[i][1] + - test.log[i][0]));
      const part = `<span class='${cssClass}'>${match}</span>`;
      optText = left + part + right;
    }

    return optText;
  }

}
