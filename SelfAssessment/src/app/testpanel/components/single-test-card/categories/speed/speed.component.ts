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
  public models: (boolean | string) [];

  /**
   * Specifies if the countdown is finished.
   */
  public done = true;

  /**
   * Specifies if at any point the test was executed.
   * Makes sure the user can execute this test only once.
   */
  public started = true;


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

    if (this.models.every(e => e === false)) {
      this.done = false;
      this.started = false;
    }
  }

  /**
   * Opens the speed test task and starts the countdown.
   */
  public startTask(): void {
    this.started = true;
  }

  /**
   * Ends the speed test and refreshes the journal log.
   */
  public endTask(): void {
    this.done = true;

    for (let i = 0; i < this.models.length; i++) {
      if (this.models[i] === false) {
        this.models[i] = '';
      }
    }
    this.journalLogService.refreshJournalLog();
  }

  /**
   * Highlights 3 chars left and right from the hoverd char.
   */
  public spanMouseAction(over: boolean, i: number, j: number): void {

    const distance = Math.ceil(this.test.options[i].correct.toString().length / 2.0);

    if (this.done) {
      return;
    }

    if (j < distance) {
      j = distance;
    } else if (j > this.coloredOptions[i].length - distance) {
      j = this.coloredOptions[i].length - distance;
    }

    for (let k = j - distance; k < j + distance; k++) {
      this.coloredOptions[i][k] = over;
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


    if (this.done) {
      return;
    }

    if (j < distance) {
      j = distance;
    } else if (j > this.coloredOptions[i].length - distance) {
      j = this.coloredOptions[i].length - distance;
    }

    this.models[i] = this.optionsSplit[i].slice(j - distance, j + distance).join('');
    this.journalLogService.refreshJournalLog();
  }

  /**
   * Removes a choosen string from the choosen options array.
   *
   * @param i Index of the option.
   */
  public removeOption(i): void {
    this.models[i] = false;
  }

}

