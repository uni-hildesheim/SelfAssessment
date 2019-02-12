import { Pipe, PipeTransform } from '@angular/core';
import { RawResultTest } from 'src/app/shared/models/evaluation/raw/raw.result.test';

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
  transform(test: RawResultTest, i: number, opt: boolean): any {

    const category = test.singleTest.category;
    let optText: string;

    if (category === 'radio-buttons') {
      optText = test.singleTest.options[i].text;

    } else if (category === 'multiple-choice') {
      optText = test.singleTest.options[i].text;

    } else if (category === 'multiple-options') {
      let header: string;

      test.log[i].forEach((element: boolean, j: number) => {
        if (element === true) {
          header = test.singleTest.header[j];
        }
      });
      const option = test.singleTest.options[i].text;
      optText = `${option}: ${header}`;

    } else if (category === 'speed') {
      const content = test.singleTest.options[i].text;
      const cssClass = (opt) ? 'correct-pick' : 'wrong-pick';
      optText = content.replace(new RegExp(test.log[i], 'gi'), match => {
        return `<span class='${cssClass}'>${match}</span>`;
      });
    }

    return optText;
  }

}
