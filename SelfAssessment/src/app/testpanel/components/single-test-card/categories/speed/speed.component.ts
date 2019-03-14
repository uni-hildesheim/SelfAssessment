import { Component, OnInit, Input } from '@angular/core';
import { JournalLogService } from 'src/app/testpanel/services/journal-log.service';
import { Speed } from 'src/app/shared/models/procedure/categories/speed.test';
import { CategoryComponent } from '../../categorie.component';

@Component({
  selector: 'app-speed',
  templateUrl: './speed.component.html',
  styleUrls: ['./speed.component.scss']
})
export class SpeedComponent implements CategoryComponent, OnInit {


  /**
   * The speed test instance.
   */
  @Input() test: Speed;

  /**
   * Every option splited into its individual chars.
   */
  public optionsSplit = [];

  /**
   * Contains the chars which are part of a substring that was choosen.
   */
  public coloredOptions = [];

  /**
   * Contains the strings of the options which the user choose.
   */
  public models: (boolean | [number, number]) [];

  public chipModels = [];


  constructor(private journalLogService: JournalLogService) { }


  ngOnInit() {
    this.test.options.forEach(rawOpt => {
      const opt = rawOpt.text;
      this.optionsSplit.push(opt.split(''));
      const temp = [];
      opt.split('').forEach(() => {
        temp.push(false);
      });
      this.coloredOptions.push(temp);
    });
  }

  /**
   * Highlights 3 chars left and right from the hoverd char.
   */
  public spanMouseAction(over: boolean, i: number, j: number): void {

    const distance = Math.ceil(this.test.options[i].correct.toString().length / 2.0);

    j = this.adjustTheDistance(i, j, distance);

    for (let k = j - distance; k < j + distance; k++) {
      this.coloredOptions[i][k] = over;
    }
  }

  public adjustTheDistance(i: number, j: number, distance: number) {
    if (j < distance) {
      return distance;
    } else if (j > this.coloredOptions[i].length - distance) {
      return this.coloredOptions[i].length - distance;
    } else {
      return j;
    }
  }


  /**
   * Adds the clicked char and x chars left and right to the choosen options.
   *
   * @param i The index of the option.
   * @param j The index of the char inside the option.
   */
  public handleModelChange(value: any, i: number, j: number): void {

    const distance = Math.ceil(this.test.options[i].correct.toString().length / 2.0);

    j = this.adjustTheDistance(i, j, distance);

    this.models[i] = [j - distance, j + distance];
    this.chipModels[i] = this.optionsSplit[i].slice(j - distance, j + distance).join('');
    this.journalLogService.refreshJournalLog();
  }

  /**
   * Removes a choosen string from the choosen options array.
   *
   * @param i Index of the option.
   */
  public removeOption(i): void {
    this.chipModels[i] = null;
    this.models[i] = [-1, -1];
    this.journalLogService.refreshJournalLog();
  }

  checkSubstringFromModel(i: number) {
    if (!this.models[i]) {
      return null;
    }
    return this.optionsSplit[i].slice(this.models[i][0], this.models[i][1]).join('');
  }


}

