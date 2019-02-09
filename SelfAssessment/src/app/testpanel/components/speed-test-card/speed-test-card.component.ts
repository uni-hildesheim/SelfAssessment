import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { JournalLogService } from '../../services/journal-log.service';
import { Test } from 'src/app/shared/models/testspecific/test.model';

/**
 * Realises the speed test category.
 */
@Component({
  selector: 'app-speed-test-card',
  templateUrl: './speed-test-card.component.html',
  styleUrls: ['./speed-test-card.component.scss']
})
export class SpeedTestCardComponent implements OnInit, OnChanges {

  /**
   * The speed test instance.
   */
  @Input() singleTest: Test;

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
  public choosenOptions = [];

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
    this.singleTest.options.forEach(rawOpt => {
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
   * Executed if the user moves to the next test.
   */
  ngOnChanges() {
    this.choosenOptions = this.journalLogService.getModelByID(this.singleTest.id);
    if (this.choosenOptions.every(e => e === false)) {
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

    for (let i = 0; i < this.choosenOptions.length; i++) {
      if (this.choosenOptions[i] === false) {
        this.choosenOptions[i] = '';
      }
    }
    this.journalLogService.refreshJournalLog();
  }

  /**
   * Highlights 3 chars left and right from the hoverd char.
   */
  public spanMouseAction(over: boolean, i: number, j: number): void {

    const distance = Math.ceil(this.singleTest.options[i].correct.toString().length / 2.0);

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
   * Adds the clicked char and 3 chars left and right to the choosen options.
   *
   * @param i The index of the option.
   * @param j The index of the char inside the option.
   */
  public spanClickAction(i: number, j: number): void {

    const distance = Math.ceil(this.singleTest.options[i].correct.toString().length / 2.0);


    if (this.done) {
      return;
    }

    if (j < distance) {
      j = distance;
    } else if (j > this.coloredOptions[i].length - distance) {
      j = this.coloredOptions[i].length - distance;
    }

    this.choosenOptions[i] = this.optionsSplit[i].slice(j - distance, j + distance).join('');
    this.journalLogService.refreshJournalLog();
  }

  /**
   * Removes a choosen string from the choosen options array.
   *
   * @param i Index of the option.
   */
  public removeOption(i): void {
    this.choosenOptions[i] = false;
  }

}
