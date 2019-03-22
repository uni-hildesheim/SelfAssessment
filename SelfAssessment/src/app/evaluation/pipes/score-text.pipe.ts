import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe which displays the proper score dependent text for a test set.
 */
@Pipe({
  name: 'scoreText'
})
export class ScoreTextPipe implements PipeTransform {

  /**
   * Checks which score text to display.
   *
   * @param scoreDependentTexts The score dependent texts.
   * @param score The users score.
   */
  transform(scoreDependentTexts: [number, string][], score: [number, number]): any {

    const percentage: number = (score[0] / score[1]) * 100.0;
    let text: string;

    for (const range of scoreDependentTexts) {
      if (percentage <= range[0]) {
        text = range[1];
        break;
      }
    }

    return text;
  }

}
